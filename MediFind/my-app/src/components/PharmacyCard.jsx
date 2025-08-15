import React, { useState } from 'react';
import {
    MapPin,
    Phone,
    MessageCircle,
    Eye,
    Heart,
    Star
} from 'lucide-react';

const PharmacyCard = ({ pharmacy = {}, onAddToFavorites, isFavorite }) => {
    const [showMedicines, setShowMedicines] = useState(false);

    const renderStars = (rating = 0) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{pharmacy.name || 'Unnamed Pharmacy'}</h3>
                    <p className="text-gray-600 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {pharmacy.address || 'No address provided'}
                    </p>
                    <div className="flex items-center mb-2">
                        <div className="flex mr-2">{renderStars(pharmacy.rating)}</div>
                        <span className="text-sm text-gray-600">
                            {pharmacy.rating ?? '0.0'} ({pharmacy.reviews ?? 0} reviews)
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => onAddToFavorites(pharmacy._id)}
                    className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {pharmacy.phone && (
                    <a
                        href={`tel:${pharmacy.phone}`}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                    </a>
                )}
                {pharmacy.whatsapp && (
                    <a
                        href={`https://wa.me/${pharmacy.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                    </a>
                )}
                <button
                    onClick={() => setShowMedicines(!showMedicines)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    {showMedicines ? 'Hide' : 'View'} Medicines
                </button>
            </div>

            {showMedicines && (
                <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Available Medicines:</h4>
                    {pharmacy.medicines?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {pharmacy.medicines.map((medicine) => (
                                <div
                                    key={medicine._id}
                                    className={`p-3 rounded-lg border ${medicine.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">{medicine.name}</span>
                                            <p className="text-sm text-gray-600">₹{medicine.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${medicine.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {medicine.available ? `${medicine.quantity} available` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No medicines available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PharmacyCard;
