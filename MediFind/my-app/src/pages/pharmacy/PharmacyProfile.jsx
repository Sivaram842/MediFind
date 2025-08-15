import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Package, DollarSign, Hash, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PharmacyProfile = () => {
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Paracetamol",
      description: "Pain reliever and fever reducer",
      price: 5.99,
      stock: 100
    },
    {
      id: 2,
      name: "Amoxicillin",
      description: "Antibiotic for bacterial infections",
      price: 12.50,
      stock: 45
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  // Pharmacy user info (in real app, this would come from auth context)
  const pharmacyUser = {
    name: "MedCare Pharmacy",
    owner: "Dr. Sarah Johnson"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      alert('Please fill in all fields');
      return;
    }

    const newMedicine = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    setMedicines(prev => [...prev, newMedicine]);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(medicine => medicine.id !== id));
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setEditFormData({
      name: medicine.name,
      description: medicine.description,
      price: medicine.price.toString(),
      stock: medicine.stock.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {

    if (!editFormData.name || !editFormData.description || !editFormData.price || !editFormData.stock) {
      alert('Please fill in all fields');
      return;
    }

    const updatedMedicine = {
      ...editingMedicine,
      name: editFormData.name,
      description: editFormData.description,
      price: parseFloat(editFormData.price),
      stock: parseInt(editFormData.stock)
    };

    setMedicines(prev => prev.map(medicine =>
      medicine.id === editingMedicine.id ? updatedMedicine : medicine
    ));

    setIsEditModalOpen(false);
    setEditingMedicine(null);
    setEditFormData({
      name: '',
      description: '',
      price: '',
      stock: ''
    });
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingMedicine(null);
    setEditFormData({
      name: '',
      description: '',
      price: '',
      stock: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediFind
            </span>
          </div>

          {/* Profile icon with logout dropdown */}
          {localStorage.getItem('authToken') && (
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2"
                onClick={() => setShowLogoutPopup(!showLogoutPopup)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              </button>

              {showLogoutPopup && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      localStorage.removeItem('authToken');
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{pharmacyUser.name}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Managed by {pharmacyUser.owner}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Medicine Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Add New Medicine
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter medicine name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Add Medicine
                </button>
              </div>
            </div>
          </div>

          {/* Medicines Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" />
                Medicine Inventory ({medicines.length})
              </h2>
              <p className="text-gray-600 mt-1">Manage your pharmacy's medicine stock</p>
            </div>

            {medicines.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No medicines yet</h3>
                <p className="text-gray-400">Add your first medicine to get started</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {medicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                          {medicine.name}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(medicine)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit medicine"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(medicine.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete medicine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{medicine.description}</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${medicine.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <Hash className="w-4 h-4" />
                          <span className="font-semibold">{medicine.stock} units</span>
                        </div>
                      </div>

                      {medicine.stock < 20 && (
                        <div className="mt-4 px-3 py-1 bg-orange-100 border border-orange-200 rounded-lg">
                          <p className="text-orange-800 text-sm font-medium">Low stock warning</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Edit Medicine</h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medicine Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editFormData.stock}
                    onChange={handleEditInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyProfile;