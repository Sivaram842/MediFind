import React, { useState, useEffect, useContext } from 'react';
import { Plus, Store, Package, DollarSign, Hash, ArrowLeft } from 'lucide-react';
import { MediFindContext } from '../../context/MediFindContext';
import { useNavigate } from 'react-router-dom';

const PharmacyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showPharmacyForm, setShowPharmacyForm] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const { currentPage, setCurrentPage, setLocation } = useContext(MediFindContext);

  const [pharmacyForm, setPharmacyForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    licenseNumber: '',
    location: '',
    owner: ''
  });

  const [medicineForm, setMedicineForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch user's pharmacy on component mount
  useEffect(() => {
    fetchMyPharmacy();
  }, []);

  // Fetch medicines when pharmacy is available
  useEffect(() => {
    if (pharmacy) {
      fetchMedicines();
    }
  }, [pharmacy]);

  const fetchMyPharmacy = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to view your pharmacy.');
        navigate('/login');
        return;
      }

      const response = await fetch('https://medifind-7.onrender.com/api/pharmacies/my-pharmacy', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPharmacy(data.pharmacy || data);
      } else if (response.status === 404) {
        setPharmacy(null);
      } else {
        console.error('Error fetching pharmacy:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching pharmacy:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://medifind-7.onrender.com/api/medicines?pharmacyId=${pharmacy._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        // If backend returns { medicines: [...] }
        setMedicines(data.medicines || data || []);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handlePharmacySubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a pharmacy.');
        navigate('/login');
        return;
      }

      const response = await fetch('https://medifind-7.onrender.com/api/pharmacies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pharmacyForm),
      });

      if (response.ok) {
        const data = await response.json();
        setPharmacy(data);
        setShowPharmacyForm(false);
        setPharmacyForm({
          name: '',
          address: '',
          phone: '',
          email: '',
          licenseNumber: '',
          location: '',
          owner: ''
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create pharmacy. Please try again.');
      }
    } catch (error) {
      console.error('Error creating pharmacy:', error);
      alert('Failed to create pharmacy. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMedicineSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to add a medicine.');
        navigate('/login');
        return;
      }

      const medicineData = {
        ...medicineForm,
        pharmacyId: pharmacy._id || pharmacy.id,
        price: parseFloat(medicineForm.price),
        stock: parseInt(medicineForm.stock)
      };

      const response = await fetch('https://medifind-7.onrender.com/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(medicineData),
      });

      if (response.ok) {
        const data = await response.json();
        setMedicines([...medicines, data]);
        setShowMedicineForm(false);
        setMedicineForm({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: ''
        });
        alert('Medicine added successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add medicine. Please try again.');
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Failed to add medicine. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://medifind-7.onrender.com/api/medicines/${medicineId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        setMedicines(medicines.filter(medicine => medicine._id !== medicineId));
        alert('Medicine deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete medicine.');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Failed to delete medicine. Please try again.');
    }
  };

  const handlePharmacyFormChange = (e) => {
    setPharmacyForm({
      ...pharmacyForm,
      [e.target.name]: e.target.value
    });
  };

  const handleMedicineFormChange = (e) => {
    setMedicineForm({
      ...medicineForm,
      [e.target.name]: e.target.value
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pharmacy information...</p>
        </div>
      </div>
    );
  }

  // No pharmacy state
  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center mb-6 cursor-pointer" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </div>

          <div className="text-center mb-8">
            <Store className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Pharmacy Dashboard</h1>
            <p className="text-gray-600 mt-2">You don't have a pharmacy registered yet. Let's set one up!</p>
          </div>

          {!showPharmacyForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowPharmacyForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Your Pharmacy
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Pharmacy</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pharmacy Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={pharmacyForm.name}
                    onChange={handlePharmacyFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter pharmacy name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={pharmacyForm.address}
                    onChange={handlePharmacyFormChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={pharmacyForm.location}
                    onChange={handlePharmacyFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location (city, area)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={pharmacyForm.phone}
                    onChange={handlePharmacyFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={pharmacyForm.email}
                    onChange={handlePharmacyFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={pharmacyForm.licenseNumber}
                    onChange={handlePharmacyFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter pharmacy license number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    name="owner"
                    value={pharmacyForm.owner}
                    onChange={handlePharmacyFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter owner name"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handlePharmacySubmit}
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    {submitting ? 'Creating...' : 'Create Pharmacy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPharmacyForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Has pharmacy state
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-6 cursor-pointer" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Home</span>
        </div>

        {/* Pharmacy Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{pharmacy.name}</h1>
          </div>
          <div className="text-gray-600">
            <p>{pharmacy.address}</p>
            <p>{pharmacy.location}</p>
            <p>{pharmacy.phone} • {pharmacy.email}</p>
            <p>License: {pharmacy.licenseNumber}</p>
            <p>Owner: {pharmacy.owner}</p>
          </div>
        </div>

        {/* Add Medicine Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Manage Medicines</h2>
            {!showMedicineForm && (
              <button
                onClick={() => setShowMedicineForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Medicine
              </button>
            )}
          </div>

          {showMedicineForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Medicine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={medicineForm.name}
                    onChange={handleMedicineFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter medicine name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={medicineForm.price}
                    onChange={handleMedicineFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={medicineForm.stock}
                    onChange={handleMedicineFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter stock quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={medicineForm.category}
                    onChange={handleMedicineFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter category (e.g., Pain Relief, Fever)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={medicineForm.description}
                    onChange={handleMedicineFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter description (optional)"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleMedicineSubmit}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  {submitting ? 'Adding...' : 'Add Medicine'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMedicineForm(false);
                    setMedicineForm({
                      name: '',
                      description: '',
                      price: '',
                      stock: '',
                      category: ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Medicines Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Your Medicines ({medicines.length})</h3>
            <button
              onClick={fetchMedicines}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {medicines.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No medicines added yet</p>
              <p className="text-gray-400">Add your first medicine to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <div key={medicine._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                  <button
                    onClick={() => handleDeleteMedicine(medicine._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Delete medicine"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg">{medicine.name}</h4>
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>

                  {medicine.description && (
                    <p className="text-gray-600 text-sm mb-3">{medicine.description}</p>
                  )}

                  {medicine.category && (
                    <div className="mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {medicine.category}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">${medicine.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">
                        Stock: {medicine.stock}
                        {medicine.stock <= 10 && (
                          <span className="text-red-500 text-xs ml-1">(Low Stock)</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyProfile;