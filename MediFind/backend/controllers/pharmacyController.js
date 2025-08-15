import Pharmacy from "../models/pharmacy.js";

// @desc    Register a new pharmacy
// @route   POST /api/pharmacies
export const addPharmacy = async (req, res) => {
    try {
        const { name, location, licenseNumber, address, phone, email } = req.body;

        // Validate
        if (!name || !location || !licenseNumber || !address || !phone) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Check if already exists for this user
        const existing = await Pharmacy.findOne({ user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: "You already registered a pharmacy" });
        }

        const pharmacy = new Pharmacy({
            name,
            location,
            licenseNumber,
            address,
            phone,
            email,
            user: req.user._id, // ✅ Link to current user
        });

        const saved = await pharmacy.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error("Error adding pharmacy:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get all pharmacies
// @route   GET /api/pharmacies
export const getAllPharmacies = async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find().populate("user", "name email");
        res.status(200).json(pharmacies);
    } catch (error) {
        console.error("Error fetching pharmacies:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get single pharmacy by ID
// @route   GET /api/pharmacies/:id
export const getPharmacyById = async (req, res) => {
    try {
        const { id } = req.params;
        const pharmacy = await Pharmacy.findById(id).populate("user", "name email");

        if (!pharmacy) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }

        res.status(200).json(pharmacy);
    } catch (error) {
        console.error("Error getting pharmacy:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Update pharmacy info
// @route   PUT /api/pharmacies/:id
export const updatePharmacy = async (req, res) => {
    try {
        const { id } = req.params;

        const pharmacy = await Pharmacy.findById(id);
        if (!pharmacy) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }

        // ✅ Ownership check
        if (pharmacy.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this pharmacy" });
        }

        const updated = await Pharmacy.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Error updating pharmacy:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Delete pharmacy
// @route   DELETE /api/pharmacies/:id
export const deletePharmacy = async (req, res) => {
    try {
        const { id } = req.params;

        const pharmacy = await Pharmacy.findById(id);
        if (!pharmacy) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }

        // ✅ Ownership check
        if (pharmacy.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this pharmacy" });
        }

        await Pharmacy.findByIdAndDelete(id);
        res.status(200).json({ message: "Pharmacy deleted successfully" });
    } catch (error) {
        console.error("Error deleting pharmacy:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
