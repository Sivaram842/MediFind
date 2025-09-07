import React, { useState, useEffect } from 'react';
import { Plus, Store, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PharmacyProfile = () => {
  const [pharmacyForm, setPharmacyForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    licenseNumber: '',
    location: '',
    owner: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user already has a pharmacy on component mount
  useEffect(() => {
    checkExistingPharmacy();
  }, []);

  const checkExistingPharmacy = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to access this page.');
        navigate('/login');
        return;
      }

      const response = await fetch('https://medifind-7.onrender.com/api/pharmacies/my-pharmacy', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const pharmacyData = await response.json();
        if (pharmacyData && pharmacyData._id) {
          navigate('/add-medicine');
        }
      }
      // If 404, show form to create pharmacy
    } catch (error) {
      console.error('Error checking pharmacy:', error);
    } finally {
      setLoading(false);
    }
  };


  // Alternative method to check if user has a pharmacy
  const checkPharmacyByAlternativeMethod = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://medifind-7.onrender.com/api/pharmacies/my-pharmacy', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const pharmacyData = await response.json();
        if (pharmacyData && pharmacyData._id) {
          navigate('/add-medicine');
        }
      }
      // If response is not OK (like 404), it means no pharmacy exists
    } catch (error) {
      console.error('Error in alternative pharmacy check:', error);
    }
  };

  // Extract user ID from token
  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId || payload._id;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  };

  const handlePharmacyFormChange = (e) => {
    setPharmacyForm({
      ...pharmacyForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreatePharmacy = async () => {
    if (!pharmacyForm.name || !pharmacyForm.address ||
      !pharmacyForm.phone || !pharmacyForm.owner ||
      !pharmacyForm.location || !pharmacyForm.licenseNumber) {
      alert('Please fill in all required fields: Name, Address, Phone, Owner, Location, and License Number');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a pharmacy.');
        navigate('/login');
        return;
      }

      const response = await fetch('https://medifind-7.render.com/api/pharmacies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pharmacyForm),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Pharmacy created successfully!');

        // Navigate to add-medicine page after successful creation
        navigate('/add-medicine');

      } else {
        console.log('Error response:', responseData);
        if (response.status === 400) {
          setErrorMessage(`Validation Error: ${responseData.message || 'Please check your input data'}`);
        } else if (response.status === 401 || response.status === 403) {
          setErrorMessage(`Permission Denied: ${responseData.message || 'Your account doesn\'t have permission to create pharmacies.'}`);
        } else if (responseData.message) {
          setErrorMessage(responseData.message);
        } else {
          setErrorMessage('Failed to create pharmacy. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error creating pharmacy:', error);
      setErrorMessage('Failed to create pharmacy. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while checking for existing pharmacy
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking pharmacy information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center mb-6 cursor-pointer" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Home</span>
        </div>

        <div className="text-center mb-8">
          <Store className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Create Your Pharmacy</h1>
          <p className="text-gray-600 mt-2">Register your pharmacy to start managing medicines</p>
        </div>

        {/* Error message display */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">Error</span>
            </div>
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pharmacy Information</h2>
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
                onClick={handleCreatePharmacy}
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Pharmacy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyProfile;