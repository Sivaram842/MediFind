import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const MedicineCard = ({ medicine = {}, onEdit, onDelete, isAdmin }) => {
    const { name, price, quantity, available, _id } = medicine;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{name || 'Unnamed Medicine'}</h3>
                    <p className="text-gray-600 mb-1">Price: ₹{price ?? 'N/A'}</p>
                    <p className="text-gray-600 mb-2">Quantity: {quantity ?? 'N/A'}</p>
                    <span
                        className={`px-2 py-1 rounded-full text-xs ${available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {available ? 'Available' : 'Out of Stock'}
                    </span>
                </div>

                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(medicine)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                            title="Edit Medicine"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(_id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                            title="Delete Medicine"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicineCard;
