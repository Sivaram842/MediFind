import React, { useState } from "react";
import API from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddMedicine = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Use API instance -> token will be attached automatically
            await API.post("/api/medicines", formData);

            navigate("/pharmacy/medicines"); // Redirect after success
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add medicine");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add New Medicine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Medicine Name"
                    required
                    className="w-full p-2 border rounded"
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    placeholder="Price"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    type="number"
                    placeholder="Stock Quantity"
                    required
                    className="w-full p-2 border rounded"
                />

                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? "Adding..." : "Add Medicine"}
                </button>
            </form>
        </div>
    );
};

export default AddMedicine;
