import React, { useState, useContext, useEffect } from 'react';
import { MediFindContext } from '../context/MediFindContext';
import {
    Search,
    MapPin,
    Package,
    Users,
    User,
    Menu,
    X,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; // Adjust path as needed

const HomePage = () => {
    const { currentPage, setCurrentPage, setLocation } = useContext(MediFindContext);
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Add this effect to handle click-away
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showLogoutPopup && !e.target.closest('.relative')) {
                setShowLogoutPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLogoutPopup]);

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => setCurrentPage('home')}
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                MediFind
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => setCurrentPage('home')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'home'
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                Home
                            </button>

                            {/* Check if user is logged in */}
                            {localStorage.getItem('authToken') ? (
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
                                        <div
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                            onClick={(e) => e.stopPropagation()} // Prevent click from reaching parent
                                        >
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem('authToken');
                                                    navigate('/');
                                                    window.location.reload();
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 p-2">
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden border-t border-gray-200">
                            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                                <button
                                    onClick={() => {
                                        setCurrentPage('home');
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    Home
                                </button>

                                {localStorage.getItem('authToken') ? (
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('authToken');
                                            navigate('/');
                                            setIsMenuOpen(false);
                                            window.location.reload();
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => navigate('/register')}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                        >
                                            Register
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Content */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Find Medicines{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Near You
                                </span>{' '}
                                Instantly
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                                Search from thousands of pharmacies and get instant results. Never worry about
                                medicine availability again.
                            </p>

                            {/* Replaced manual search inputs with SearchBar */}
                            <div className="max-w-2xl">
                                <SearchBar
                                    onSearch={({ medicine, location }) => {
                                        setLocation(location);
                                        setCurrentPage('search-results');
                                        // If you want, you can also save medicine to state or context here
                                    }}
                                    onLocationChange={({ latitude, longitude }) => {
                                        // Optional: handle live location updates if needed
                                        // console.log('User location changed:', latitude, longitude);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right Side - Illustration */}
                        <div className="relative lg:order-last">
                            <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 lg:p-12">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl p-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                            <Package className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Medicine Search</h3>
                                        <p className="text-sm text-gray-600">Find any medicine instantly</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform mt-8">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                            <MapPin className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Nearby Stores</h3>
                                        <p className="text-sm text-gray-600">Locate pharmacies around you</p>
                                    </div>
                                </div>
                                <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <Users className="h-6 w-6 text-green-600" />
                                        </div>
                                        <span className="text-2xl font-bold text-green-600">10K+</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Happy Users</h3>
                                    <p className="text-sm text-gray-600">Join our growing community</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MediFind?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience the future of medicine discovery with our innovative platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Search className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Search Medicines</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Instantly find available medicines near you with our powerful search engine. Get
                                real-time availability and pricing information.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MapPin className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nearby Pharmacies</h3>
                            <p className="text-gray-600 leading-relaxed">
                                View pharmacies on an interactive map with directions, contact information, and
                                operating hours for your convenience.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pharmacy Dashboard</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Manage inventory and medicine availability with our comprehensive dashboard designed
                                for pharmacy owners.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join MediFind Today</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Whether you're a pharmacy or a user, MediFind helps you connect instantly. Join thousands
                        of users and hundreds of pharmacies already using our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setCurrentPage('register')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            Register as Pharmacy
                        </button>
                        <button
                            onClick={() => {
                                const searchBar = document.querySelector('input[placeholder="Medicine name..."]');
                                if (searchBar) searchBar.focus();
                            }}
                            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200"
                        >
                            Search for Medicines
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left - Logo & Tagline */}
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">MediFind</span>
                            </div>
                            <p className="text-gray-400">
                                Connecting you to medicines and pharmacies, instantly and efficiently.
                            </p>
                        </div>

                        {/* Center - Quick Links */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setCurrentPage('home')}
                                    className="block w-full text-gray-400 hover:text-white transition-colors"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="block w-full text-gray-400 hover:text-white transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="block w-full text-gray-400 hover:text-white transition-colors"
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        {/* Right - Social Media */}
                        <div className="text-right">
                            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                            <div className="flex justify-end space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Facebook className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Twitter className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Instagram className="h-6 w-6" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Linkedin className="h-6 w-6" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom - Copyright */}
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-400">
                            © 2025 MediFind. All rights reserved. Built with ❤️ for better healthcare access.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
