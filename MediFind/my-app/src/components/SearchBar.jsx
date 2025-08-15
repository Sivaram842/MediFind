import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, onLocationChange }) => {
    const [medicineQuery, setMedicineQuery] = useState('');
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [fetchingLocation, setFetchingLocation] = useState(false);

    const medicineSuggestions = [
        'Paracetamol',
        'Amoxicillin',
        'Crocin',
        'Insulin',
        'Ventolin Inhaler',
        'Aspirin',
    ];

    const handleMedicineSearch = (value) => {
        setMedicineQuery(value);
        if (value.trim().length > 1) {
            const filtered = medicineSuggestions.filter((med) =>
                med.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setFetchingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    setLocation(locStr);
                    setFetchingLocation(false);
                    onLocationChange && onLocationChange({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setFetchingLocation(false);
                }
            );
        }
    };

    const handleSearch = () => {
        onSearch &&
            onSearch({
                medicine: medicineQuery.trim(),
                location: location.trim(),
            });
        setShowSuggestions(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Medicine Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for medicines..."
                            value={medicineQuery}
                            onChange={(e) => handleMedicineSearch(e.target.value)}
                            aria-label="Search medicine"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-auto">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setMedicineQuery(suggestion);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Location Input */}
                    <div className="flex-1 relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Enter pincode or location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            aria-label="Enter location"
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={getCurrentLocation}
                            className="absolute right-3 top-2 text-blue-500 hover:text-blue-700 disabled:opacity-50"
                            disabled={fetchingLocation}
                            title="Use current location"
                        >
                            <MapPin className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        aria-label="Search button"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
