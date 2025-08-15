import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String }, // city or pincode
    licenseNumber: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 👈 add this
    createdAt: { type: Date, default: Date.now }
});

const Pharmacy = mongoose.models.Pharmacy || mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy;
