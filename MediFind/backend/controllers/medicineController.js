import fs from "fs";
import path from "path";
import Medicine from "../models/medicine.js";
import Pharmacy from "../models/pharmacy.js";

// Ensure directory exists before writing
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Add a new medicine (pharmacyId is optional, we use req.user._id)
export const addMedicine = async (req, res) => {
    try {
        const {
            name, brand, price, stock,
            expiryDate, category, dosage,
            prescriptionRequired
        } = req.body;

        const pharmacyId = req.user._id; // authenticated user

        const pharmacy = await Pharmacy.findOne({ user: req.user._id });
        if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found for this user" });

        const medicine = new Medicine({
            name,
            brand,
            price,
            stock,
            expiryDate,
            category,
            dosage,
            prescriptionRequired,
            pharmacy: pharmacyId,
        });

        const savedMedicine = await medicine.save();

        ensureDirExists("logs");
        fs.appendFileSync("logs/medicine.log", `Added: ${savedMedicine.name} at ${new Date().toISOString()}\n`);

        res.status(201).json(savedMedicine);
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all medicines
export const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().populate("pharmacy");
        res.status(200).json(medicines);
    } catch (error) {
        console.error("Error fetching medicines:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Advanced search with filters
export const searchMedicines = async (req, res) => {
    try {
        const {
            name,
            location,
            pharmacyName,
            inStock,
            minPrice,
            maxPrice,
            category
        } = req.query;

        // Step 1: Filter pharmacies based on location or name
        let pharmacyFilter = {};
        if (location) pharmacyFilter.location = new RegExp(location, "i");
        if (pharmacyName) pharmacyFilter.name = new RegExp(pharmacyName, "i");

        const pharmacies = await Pharmacy.find(pharmacyFilter).select("_id");
        const pharmacyIds = pharmacies.map(p => p._id);

        // Step 2: Build medicine filter
        let medicineFilter = {};

        if (name) medicineFilter.name = new RegExp(name, "i");
        if (category) medicineFilter.category = new RegExp(category, "i");
        if (inStock === "true") medicineFilter.stock = { $gt: 0 };

        if (minPrice || maxPrice) {
            medicineFilter.price = {};
            if (minPrice) medicineFilter.price.$gte = Number(minPrice);
            if (maxPrice) medicineFilter.price.$lte = Number(maxPrice);
        }

        if (pharmacyIds.length > 0) {
            medicineFilter.pharmacy = { $in: pharmacyIds };
        }

        const medicines = await Medicine.find(medicineFilter)
            .populate("pharmacy", "name location address phone");

        res.status(200).json(medicines);
    } catch (error) {
        console.error("Error searching medicines:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Update medicine (only if owned by current pharmacy)
export const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        const medicine = await Medicine.findById(id);
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });

        // 🔑 Find pharmacy linked to this user
        const pharmacy = await Pharmacy.findOne({ user: req.user._id });
        if (!pharmacy) return res.status(403).json({ message: "Pharmacy not found for this user" });

        if (medicine.pharmacy.toString() !== pharmacy.user.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this medicine" });
        }

        const updated = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Error updating medicine:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete medicine (only if owned by current pharmacy)
export const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        const medicine = await Medicine.findById(id);
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });

        // 🔑 Get pharmacy linked to user
        const pharmacy = await Pharmacy.findOne({ user: req.user._id });
        if (!pharmacy) return res.status(403).json({ message: "Pharmacy not found for this user" });

        if (medicine.pharmacy.toString() !== pharmacy.user.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this medicine" });
        }

        const deleted = await Medicine.findByIdAndDelete(id);

        ensureDirExists("backups");
        ensureDirExists("logs");

        const backupPath = path.join("backups", `deleted-${deleted._id}.json`);
        fs.writeFileSync(backupPath, JSON.stringify(deleted, null, 2));

        fs.appendFileSync(
            "logs/medicine.log",
            `Deleted: ${deleted.name} by pharmacy ${req.user._id} at ${new Date().toISOString()}\n`
        );

        res.status(200).json({ message: "Medicine deleted and backed up successfully" });
    } catch (error) {
        console.error("Error deleting medicine:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
