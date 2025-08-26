import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Package, DollarSign, Hash, User, RefreshCw, AlertCircle, Key, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PharmacyProfile = () => {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const pharmacyUser = {
    name: "MedCare Pharmacy",
    owner: "Dr. Sarah Johnson"
  };

  // Check token validity and extract user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to access this page.');
      navigate('/login');
      return;
    }

    // Extract user info from token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      // Set user ID from token
      setUserId(payload.id);

      // Check if token contains role information
      if (payload.role) {
        setUserRole(payload.role);
      } else {
        // If no role in token, try to fetch user profile
        fetchUserProfile(token);
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }

    // Load medicines from API
    loadMedicines();
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        'https://medifind-7.onrender.com/api/users/me',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (response.data.role) {
        setUserRole(response.data.role);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const loadMedicines = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://medifind-7.onrender.com/api/medicines',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      setMedicines(response.data.medicines || []);
    } catch (error) {
      console.error('Error loading medicines:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleAuthError(error);
      } else {
        setErrorMessage('Failed to load medicines. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error) => {
    setDebugInfo({
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });

    setErrorMessage('Authentication error. Please check your token permissions.');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      alert('Please fill in all fields');
      return;
    }

    const newMedicine = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    try {
      setIsLoading(true);
      setErrorMessage('');

      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to add a medicine.');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'https://medifind-7.onrender.com/api/medicines',
        newMedicine,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMedicines(prev => [...prev, response.data]);
      alert('Medicine added successfully!');

      setFormData({
        name: '',
        description: '',
        price: '',
        stock: ''
      });

    } catch (error) {
      console.error('Error adding medicine:', error);

      // Capture debug information
      setDebugInfo({
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        if (error.response?.data?.message === "Pharmacy not found for this user") {
          setErrorMessage(`Pharmacy Account Required: You need a pharmacy account to add medicines.`);
        } else {
          setErrorMessage(`Permission Denied (403): ${error.response?.data?.message || 'Your account doesn\'t have permission to add medicines.'}`);
        }
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to add medicine. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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

  const copyTokenToClipboard = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copied to clipboard');
    }
  };

  const viewTokenDetails = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        alert(`Token Details:\nExp: ${new Date(payload.exp * 1000).toLocaleString()}\nUser ID: ${payload.id}\nRole: ${payload.role || 'Not specified'}`);
      } catch (error) {
        alert('Error parsing token: ' + error.message);
      }
    }
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

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Debug
            </button>

            {localStorage.getItem('token') && (
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
                      onClick={copyTokenToClipboard}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      Copy Token
                    </button>
                    <button
                      onClick={viewTokenDetails}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Token Info
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
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
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Debug Information
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <h4 className="text-sm font-semibold text-yellow-700">User ID</h4>
                <p className="text-sm text-yellow-600 font-mono truncate">
                  {userId || 'Not available'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-yellow-700">User Role</h4>
                <p className="text-sm text-yellow-600">
                  {userRole || 'Unknown'}
                </p>
              </div>
            </div>

            {debugInfo && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-yellow-700 mb-1">Last Error Details</h4>
                <div className="bg-white p-3 rounded-lg border border-yellow-200 text-xs font-mono overflow-auto max-h-40">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="mt-3 flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
              >
                Clear Token & Relogin
              </button>

              <button
                onClick={loadMedicines}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              >
                Test GET Request
              </button>
            </div>
          </div>
        )}

        {/* Error message display */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5" />
              <span className="font-semibold">Permission Error</span>
            </div>
            <p>{errorMessage}</p>
            <div className="mt-2 text-sm">
              <p>Your account may need to be associated with a pharmacy to add medicines.</p>
              <p className="mt-1">Please contact the administrator for assistance.</p>
            </div>
          </div>
        )}

        {/* Header with role information */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{pharmacyUser.name}</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Managed by {pharmacyUser.owner}
                  {userRole && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Role: {userRole}
                    </span>
                  )}
                </p>
                {userId && (
                  <p className="text-gray-500 text-sm mt-1">
                    User ID: <span className="font-mono">{userId}</span>
                  </p>
                )}
              </div>
              <button
                onClick={loadMedicines}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
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
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Medicine'
                  )}
                </button>

                {userRole && userRole !== 'admin' && userRole !== 'pharmacy' && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
                    <p className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Your role ({userRole}) may not have permission to add medicines.
                    </p>
                  </div>
                )}
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

            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
                <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Loading medicines...</h3>
              </div>
            ) : medicines.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No medicines yet</h3>
                <p className="text-gray-400">Add your first medicine to get started</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {medicines.map((medicine) => (
                  <div
                    key={medicine._id || medicine.id}
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
                            onClick={() => handleDelete(medicine._id || medicine.id)}
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
    </div>
  );
};

export default PharmacyProfile;