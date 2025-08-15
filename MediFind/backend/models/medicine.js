import mongoose from "mongoose";


const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    category: { type: String }, // Tablet, Syrup, etc.
    dosage: { type: String }, // e.g., "500mg"
    prescriptionRequired: { type: Boolean, default: false },
    pharmacy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true
    },
    addedAt: { type: Date, default: Date.now }
});




// Safe model creation
const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);
export default Medicine;