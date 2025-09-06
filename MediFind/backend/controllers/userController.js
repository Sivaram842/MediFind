import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// 🔐 Helper to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// ✅ Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user" // 'user' or 'pharmacyAdmin'
        });

        const savedUser = await user.save();

        // ✅ return token
        const token = generateToken(savedUser._id);

        res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
            token: generateToken(savedUser._id) // ✅ Return token
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id) // ✅ Return token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Get all users (protected)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.error("Fetch user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Update user info (protected)
export const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        ).select("-password");

        if (!updated) return res.status(404).json({ message: "User not found" });

        res.status(200).json(updated);
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Delete user (protected)
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// ✅ Add pharmacy ID to user
export const addPharmacyToUser = async (req, res) => {
    try {
        const { userId, pharmacyId } = req.body;

        if (!userId || !pharmacyId) {
            return res.status(400).json({ message: "userId and pharmacyId are required" });
        }

        // Push pharmacyId to user's pharmacies array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { pharmacies: pharmacyId } }, // prevents duplicate entries
            { new: true }
        ).populate("pharmacies", "name address phone"); // optional populate

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error adding pharmacy to user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// ✅ Retrieve pharmacy IDs from a user
export const getUserPharmacies = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("name email pharmacies")
            .populate("pharmacies", "name address phone"); // optional: show details

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.pharmacies); // return only pharmacies
    } catch (error) {
        console.error("Error fetching pharmacies:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
