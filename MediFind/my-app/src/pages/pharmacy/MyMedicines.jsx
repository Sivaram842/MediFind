import React, { useState, useMemo } from 'react';
import { Search, Pill, X, Package, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyMedicines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const navigate = useNavigate();
  // Dummy data for medicines
  const medicines = [
    {
      id: 1,
      name: 'Acetaminophen',
      description: 'Pain reliever and fever reducer commonly used for headaches, muscle aches, and cold symptoms.',
      stock: 24,
      usage: 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.',
      category: 'Pain Relief',
      expiryDate: '2025-12-15',
      manufacturer: 'MedCorp',
      strength: '500mg'
    },
    {
      id: 2,
      name: 'Ibuprofen',
      description: 'Anti-inflammatory medication used to reduce inflammation, pain, and fever.',
      stock: 18,
      usage: 'Take 1-2 tablets every 6-8 hours with food. Maximum 6 tablets per day.',
      category: 'Anti-inflammatory',
      expiryDate: '2025-10-22',
      manufacturer: 'PharmaTech',
      strength: '400mg'
    },
    {
      id: 3,
      name: 'Vitamin D3',
      description: 'Essential vitamin supplement for bone health and immune system support.',
      stock: 45,
      usage: 'Take 1 tablet daily with a meal containing fat for better absorption.',
      category: 'Supplement',
      expiryDate: '2026-03-10',
      manufacturer: 'VitaLife',
      strength: '2000 IU'
    },
    {
      id: 4,
      name: 'Amoxicillin',
      description: 'Antibiotic used to treat bacterial infections including respiratory and urinary tract infections.',
      stock: 12,
      usage: 'Take as prescribed by your doctor. Complete the full course even if you feel better.',
      category: 'Antibiotic',
      expiryDate: '2025-08-30',
      manufacturer: 'BioMed',
      strength: '250mg'
    },
    {
      id: 5,
      name: 'Omega-3 Fish Oil',
      description: 'Dietary supplement rich in EPA and DHA for heart and brain health.',
      stock: 30,
      usage: 'Take 1-2 capsules daily with meals to reduce fishy aftertaste.',
      category: 'Supplement',
      expiryDate: '2026-01-15',
      manufacturer: 'OceanHealth',
      strength: '1000mg'
    },
    {
      id: 6,
      name: 'Loratadine',
      description: 'Antihistamine medication for treating allergies and hay fever symptoms.',
      stock: 20,
      usage: 'Take 1 tablet once daily. Can be taken with or without food.',
      category: 'Allergy Relief',
      expiryDate: '2025-11-08',
      manufacturer: 'AllerCare',
      strength: '10mg'
    }
  ];

  // Filter medicines based on search term
  const filteredMedicines = useMemo(() => {
    return medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, medicines]);

  const getStockStatus = (stock) => {
    if (stock < 10) return { color: 'text-red-600', label: 'Low Stock' };
    if (stock < 20) return { color: 'text-yellow-600', label: 'Medium Stock' };
    return { color: 'text-green-600', label: 'In Stock' };
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Pain Relief': 'bg-blue-100 text-blue-800',
      'Anti-inflammatory': 'bg-purple-100 text-purple-800',
      'Supplement': 'bg-green-100 text-green-800',
      'Antibiotic': 'bg-red-100 text-red-800',
      'Allergy Relief': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => window.location.href = '/'}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MediFind
          </span>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Medicines</h1>
          <p className="text-gray-600">Manage and track your medication inventory</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Medicine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine) => {
            const stockStatus = getStockStatus(medicine.stock);
            return (
              <div
                key={medicine.id}
                onClick={() => setSelectedMedicine(medicine)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Pill className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{medicine.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(medicine.category)}`}>
                          {medicine.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Stock: {medicine.stock}</span>
                    </div>
                    <span className={`text-sm font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No medicines found</h3>
            <p className="text-gray-400">Try adjusting your search term</p>
          </div>
        )}

        {/* Modal for Medicine Details */}
        {selectedMedicine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Pill className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedMedicine.name}</h2>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-1 ${getCategoryColor(selectedMedicine.category)}`}>
                      {selectedMedicine.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Stock Information</h3>
                      <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">Available: {selectedMedicine.stock} units</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatus(selectedMedicine.stock).color === 'text-red-600' ? 'bg-red-100 text-red-800' : getStockStatus(selectedMedicine.stock).color === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {getStockStatus(selectedMedicine.stock).label}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Details</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Strength: {selectedMedicine.strength}</div>
                        <div>Manufacturer: {selectedMedicine.manufacturer}</div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Expires: {selectedMedicine.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        <span>Usage Instructions</span>
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 p-3 rounded-lg">
                        {selectedMedicine.usage}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedMedicine.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMedicines;