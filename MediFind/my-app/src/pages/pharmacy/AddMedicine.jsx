import React, { useState, useContext, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Package, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AddMedicine = () => {
    const [pharmacy, setPharmacy] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        stock: '',
        expiryDate: '',
        category: 'Tablet',
        dosage: '',
        prescriptionRequired: false,
        description: ''
    });

    const categories = ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Other'];
    const token = localStorage.getItem('token');

    const fetchPharmacy = async () => {
        try {
            const response = await fetch('https://medifind-7.onrender.com/api/pharmacies/my-pharmacy', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPharmacy(data);
            } else {
                setPharmacy(null);
            }
        } catch (error) {
            console.error('Error fetching pharmacy:', error);
            setPharmacy(null);
        }
    };

    const fetchMedicines = async () => {
        if (!pharmacy) return; // Ensure pharmacy exists before fetching
        try {
            const response = await fetch(`https://medifind-7.onrender.com/api/medicines/pharmacy/${pharmacy._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMedicines(data.medicines); // Adjust according to your API response format
            } else {
                setMedicines([]);
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setMedicines([]);
        }
    };



    useEffect(() => {
        const loadPharmacy = async () => {
            setLoading(true);
            await fetchPharmacy();
            setLoading(false);
        };
        loadPharmacy();
    }, []);

    useEffect(() => {
        if (pharmacy) {
            fetchMedicines();
        }
    }, [pharmacy]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pharmacy) {
            setError('No pharmacy found. Please create your pharmacy first.');
            return;
        }

        setFormLoading(true);
        setError('');
        setSuccess('');

        try {
            const medicineData = {
                name: formData.name,
                brand: formData.brand,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                expiryDate: formData.expiryDate,
                category: formData.category,
                dosage: formData.dosage,
                prescriptionRequired: formData.prescriptionRequired,
                description: formData.description,
                pharmacyId: pharmacy._id
            };

            const response = await fetch('https://medifind-7.onrender.com/api/medicines', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(medicineData)
            });

            const responseData = await response.json();

            if (!response.ok) throw new Error(responseData.message || 'Failed to add medicine');

            setFormData({
                name: '',
                brand: '',
                price: '',
                stock: '',
                expiryDate: '',
                category: 'Tablet',
                dosage: '',
                prescriptionRequired: false,
                description: ''
            });

            setSuccess('Medicine added successfully!');
            await fetchMedicines();
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            setError(error.message || 'Failed to add medicine. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    // Handle delete medicine
    const handleDelete = async (medicineId) => {
        if (!window.confirm('Are you sure you want to delete this medicine?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Ensure token is used
            const response = await fetch(`https://medifind-7.onrender.com/api/medicines/${medicineId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ✅ include token
                },
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to delete medicine');
            }

            setSuccess('Medicine deleted successfully!');
            await fetchMedicines(); // Refresh list
            setTimeout(() => setSuccess(''), 3000);

        } catch (error) {
            setError(error.message || 'Failed to delete medicine.');
        }
    };

    // Handle edit medicine (placeholder - you can implement edit functionality)
    const handleEdit = (medicine) => {
        // Set form data to medicine values for editing
        setFormData({
            name: medicine.name,
            brand: medicine.brand || '',
            price: medicine.price.toString(),
            stock: medicine.stock.toString(),
            expiryDate: medicine.expiryDate.split('T')[0], // Format date for input
            category: medicine.category,
            dosage: medicine.dosage || '',
            prescriptionRequired: medicine.prescriptionRequired
        });

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Check if medicine is near expiry (within 30 days)
    const isNearExpiry = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        return expiry <= thirtyDaysFromNow;
    };

    // Check if medicine is expired
    const isExpired = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        return expiry < today;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading pharmacy data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
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
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Medicine Management</h1>
                    <p className="text-gray-600 mt-2">Add and manage medicines for your pharmacy</p>
                </div>

                {/* Pharmacy Info Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Pharmacy Information</h2>
                    {pharmacy ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <Plus className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{pharmacy.name}</p>
                                    <p className="text-sm text-gray-600">Pharmacy Name</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{pharmacy.address}</p>
                                    <p className="text-sm text-gray-600">Address</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <Phone className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{pharmacy.contact}</p>
                                    <p className="text-sm text-gray-600">Contact</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                            <p className="text-lg text-gray-700">No pharmacy found. Please create your pharmacy first.</p>
                            <p className="text-sm text-gray-500 mt-2">You need to set up your pharmacy profile before adding medicines.</p>
                        </div>
                    )}
                </div>

                {/* Add Medicine Form */}
                {pharmacy && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Medicine</h2>

                        {/* Success/Error Messages */}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Medicine Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medicine Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter medicine name"
                                />
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter brand name"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dosage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dosage
                                </label>
                                <input
                                    type="text"
                                    name="dosage"
                                    value={formData.dosage}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 500mg, 10ml"
                                />
                            </div>

                            {/* Prescription Required */}
                            <div className="flex items-center space-x-2 pt-6">
                                <input
                                    type="checkbox"
                                    name="prescriptionRequired"
                                    id="prescriptionRequired"
                                    checked={formData.prescriptionRequired}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="prescriptionRequired" className="text-sm font-medium text-gray-700">
                                    Prescription Required
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discription
                                </label>
                                <textarea
                                    type="text"
                                    rows="4"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter about medicine"
                                />
                            </div>



                            {/* Submit Button */}
                            <div className="md:col-span-2 lg:col-span-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
                                >
                                    {formLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Adding Medicine...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            <span>Add Medicine</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Medicines Display */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Medicine Inventory</h2>
                        <div className="text-sm text-gray-600">
                            Total: {medicines.length} medicines
                        </div>
                    </div>

                    {medicines.length === 0 ? (
                        <div className="text-center py-12">
                            <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg text-gray-600 mb-2">No medicines added yet.</p>
                            <p className="text-gray-500">Add your first medicine using the form above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {medicines.map((medicine) => (
                                <div
                                    key={medicine.id}
                                    className={`border rounded-lg p-4 transition-all hover:shadow-lg ${isExpired(medicine.expiryDate)
                                        ? 'border-red-300 bg-red-50'
                                        : isNearExpiry(medicine.expiryDate)
                                            ? 'border-orange-300 bg-orange-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-lg truncate">{medicine.name}</h3>
                                            {medicine.brand && (
                                                <p className="text-sm text-gray-600 truncate">{medicine.brand}</p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2 ml-2">
                                            <button
                                                onClick={() => handleEdit(medicine)}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors"
                                                title="Edit medicine"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(medicine.id)}
                                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                                                title="Delete medicine"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="font-medium text-green-600">${medicine.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Stock:</span>
                                            <span className={`font-medium ${medicine.stock < 10 ? 'text-red-600' : 'text-gray-800'}`}>
                                                {medicine.stock}
                                                {medicine.stock < 10 && <span className="text-xs ml-1">(Low)</span>}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Expiry:</span>
                                            <span className={`font-medium ${isExpired(medicine.expiryDate)
                                                ? 'text-red-600'
                                                : isNearExpiry(medicine.expiryDate)
                                                    ? 'text-orange-600'
                                                    : 'text-gray-800'
                                                }`}>
                                                {formatDate(medicine.expiryDate)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium">{medicine.category}</span>
                                        </div>
                                        {medicine.dosage && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Dosage:</span>
                                                <span className="font-medium">{medicine.dosage}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Prescription:</span>
                                            <span className={`font-medium ${medicine.prescriptionRequired ? 'text-red-600' : 'text-green-600'}`}>
                                                {medicine.prescriptionRequired ? 'Required' : 'Not Required'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Indicators */}
                                    <div className="mt-3 space-y-2">
                                        {isExpired(medicine.expiryDate) && (
                                            <div className="p-2 bg-red-100 border border-red-300 rounded flex items-center">
                                                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                                                <span className="text-sm text-red-700 font-medium">EXPIRED</span>
                                            </div>
                                        )}
                                        {!isExpired(medicine.expiryDate) && isNearExpiry(medicine.expiryDate) && (
                                            <div className="p-2 bg-orange-100 border border-orange-300 rounded flex items-center">
                                                <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                                                <span className="text-sm text-orange-700">Expires soon!</span>
                                            </div>
                                        )}
                                        {medicine.stock < 10 && (
                                            <div className="p-2 bg-yellow-100 border border-yellow-300 rounded flex items-center">
                                                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                                                <span className="text-sm text-yellow-700">Low stock</span>
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
    );
};

export default AddMedicine;