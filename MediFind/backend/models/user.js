import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true }, // Store hashed passwords
    role: { type: String, enum: ['user', 'admin', 'pharmacy'], default: 'user' },
    address: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
