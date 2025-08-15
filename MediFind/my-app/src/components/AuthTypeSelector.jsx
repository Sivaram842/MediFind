import React from "react";
import { User, Store } from "lucide-react";

const AuthTypeSelector = ({ onSelect, title = "Welcome to MediFind" }) => {
    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{title}</h2>
            <div className="space-y-4">
                <button
                    onClick={() => onSelect("user")}
                    className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition duration-200"
                >
                    <User className="h-6 w-6 text-blue-500" />
                    <span className="text-lg font-medium text-blue-700">Continue as User</span>
                </button>

                <button
                    onClick={() => onSelect("pharmacyAdmin")}
                    className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-green-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition duration-200"
                >
                    <Store className="h-6 w-6 text-green-500" />
                    <span className="text-lg font-medium text-green-700">Continue as Pharmacy</span>
                </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>By continuing, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.</p>
            </div>
        </div>
    );
};

export default AuthTypeSelector;
