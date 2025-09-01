import React, { useState } from 'react';
import { Store, MapPin, Clock, Phone, Mail, Package, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyPharmacies = () => {
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const navigate = useNavigate();
  // Sample pharmacy data
  const pharmacies = [
    {
      id: 1,
      name: "HealthPlus Pharmacy",
      location: "Downtown Medical Center",
      address: "123 Health Street, Medical District, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "contact@healthplus.com",
      hours: {
        weekdays: "8:00 AM - 10:00 PM",
        saturday: "9:00 AM - 8:00 PM",
        sunday: "10:00 AM - 6:00 PM"
      },
      medicines: [
        "Paracetamol 500mg", "Ibuprofen 400mg", "Amoxicillin 250mg",
        "Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg",
        "Omeprazole 20mg", "Levothyroxine 50mcg", "Amlodipine 5mg"
      ]
    },
    {
      id: 2,
      name: "CareWell Drugstore",
      location: "Riverside Mall",
      address: "456 River Avenue, Shopping Complex, NY 10002",
      phone: "+1 (555) 234-5678",
      email: "info@carewell.com",
      hours: {
        weekdays: "9:00 AM - 9:00 PM",
        saturday: "9:00 AM - 9:00 PM",
        sunday: "11:00 AM - 7:00 PM"
      },
      medicines: [
        "Aspirin 81mg", "Cetirizine 10mg", "Dextromethorphan 15mg",
        "Fluoxetine 20mg", "Gabapentin 300mg", "Hydrochlorothiazide 25mg",
        "Insulin Glargine", "Montelukast 10mg", "Prednisone 5mg"
      ]
    },
    {
      id: 3,
      name: "MediCare Express",
      location: "University District",
      address: "789 Campus Drive, University Area, NY 10003",
      phone: "+1 (555) 345-6789",
      email: "support@medicareexpress.com",
      hours: {
        weekdays: "7:00 AM - 11:00 PM",
        saturday: "8:00 AM - 10:00 PM",
        sunday: "9:00 AM - 9:00 PM"
      },
      medicines: [
        "Albuterol Inhaler", "Azithromycin 250mg", "Clonazepam 0.5mg",
        "Duloxetine 30mg", "Esomeprazole 40mg", "Furosemide 40mg",
        "Glipizide 5mg", "Hydroxyzine 25mg", "Metoprolol 50mg"
      ]
    },
    {
      id: 4,
      name: "Family Health Pharmacy",
      location: "Suburban Plaza",
      address: "321 Family Lane, Residential Area, NY 10004",
      phone: "+1 (555) 456-7890",
      email: "hello@familyhealth.com",
      hours: {
        weekdays: "8:30 AM - 8:30 PM",
        saturday: "9:00 AM - 7:00 PM",
        sunday: "10:00 AM - 5:00 PM"
      },
      medicines: [
        "Acetaminophen 325mg", "Bupropion 150mg", "Citalopram 20mg",
        "Diclofenac 75mg", "Enalapril 10mg", "Fexofenadine 180mg",
        "Glyburide 5mg", "Hydrocodone/APAP", "Losartan 50mg"
      ]
    },
    {
      id: 5,
      name: "QuickMeds 24/7",
      location: "Central Station",
      address: "654 Transit Hub, Central District, NY 10005",
      phone: "+1 (555) 567-8901",
      email: "service@quickmeds247.com",
      hours: {
        weekdays: "24 Hours",
        saturday: "24 Hours",
        sunday: "24 Hours"
      },
      medicines: [
        "Warfarin 5mg", "Simvastatin 40mg", "Tramadol 50mg",
        "Sertraline 50mg", "Ranitidine 150mg", "Pantoprazole 40mg",
        "Naproxen 220mg", "Meloxicam 15mg", "Lorazepam 1mg"
      ]
    },
    {
      id: 6,
      name: "Wellness Corner",
      location: "Green Valley",
      address: "987 Wellness Way, Green Valley, NY 10006",
      phone: "+1 (555) 678-9012",
      email: "care@wellnesscorner.com",
      hours: {
        weekdays: "8:00 AM - 9:00 PM",
        saturday: "9:00 AM - 8:00 PM",
        sunday: "10:00 AM - 6:00 PM"
      },
      medicines: [
        "Vitamin D3 1000IU", "Calcium Carbonate 500mg", "Iron Sulfate 325mg",
        "Multivitamin", "Fish Oil 1000mg", "Probiotics", "Magnesium 400mg",
        "Zinc 50mg", "Coenzyme Q10", "Glucosamine 1500mg"
      ]
    }
  ];

  const openPharmacyDetails = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
  };

  const closePharmacyDetails = () => {
    setSelectedPharmacy(null);
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Pharmacies</h1>
          <p className="text-gray-600">Find and explore pharmacies in your area</p>
        </div>

        {/* Pharmacy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              onClick={() => openPharmacyDetails(pharmacy)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <Store className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {pharmacy.name}
                    </h3>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{pharmacy.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">
                    Click to view details and available medicines
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {pharmacy.medicines.length} medicines available
                    </span>
                    <div className="text-xs text-gray-500">
                      {pharmacy.hours.weekdays}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Pharmacy Details */}
        {selectedPharmacy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedPharmacy.name}
                </h2>
                <button
                  onClick={closePharmacyDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Contact Information
                    </h3>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-700">Address</p>
                        <p className="text-gray-600">{selectedPharmacy.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">Phone</p>
                        <p className="text-gray-600">{selectedPharmacy.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">Email</p>
                        <p className="text-gray-600">{selectedPharmacy.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Opening Hours
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-700">Monday - Friday</p>
                          <p className="text-gray-600">{selectedPharmacy.hours.weekdays}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-8">
                        <div>
                          <p className="font-medium text-gray-700">Saturday</p>
                          <p className="text-gray-600">{selectedPharmacy.hours.saturday}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-8">
                        <div>
                          <p className="font-medium text-gray-700">Sunday</p>
                          <p className="text-gray-600">{selectedPharmacy.hours.sunday}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Available Medicines */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Available Medicines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedPharmacy.medicines.map((medicine, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <p className="text-sm font-medium text-gray-700">{medicine}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPharmacies;