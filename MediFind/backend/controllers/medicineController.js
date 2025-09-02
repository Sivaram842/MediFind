import Medicine from "../models/medicine.js";
import Pharmacy from "../models/pharmacy.js";

// ✅ Get medicine by ID (with pharmacy details)
export const getMedicineById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findById(id)
            .populate("pharmacy", "name address phone location");

        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json(medicine);
    } catch (error) {
        console.error("Error getting medicine:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Get medicines by pharmacy ID
export const getMedicinesByPharmacy = async (req, res) => {
    try {
        const { pharmacyId } = req.params;

        // Verify pharmacy exists
        const pharmacy = await Pharmacy.findById(pharmacyId);
        if (!pharmacy) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }

        const medicines = await Medicine.find({ pharmacy: pharmacyId })
            .populate("pharmacy", "name address phone location");

        res.status(200).json({
            medicines,
            pharmacy: {
                _id: pharmacy._id,
                name: pharmacy.name,
                address: pharmacy.address,
                phone: pharmacy.phone,
                location: pharmacy.location
            }
        });
    } catch (error) {
        console.error("Error fetching pharmacy medicines:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Get all medicines (with optional filters + populate)
export const getAllMedicines = async (req, res) => {
    try {
        const { pharmacyId, category, inStock, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        let filter = {};

        if (pharmacyId) filter.pharmacy = pharmacyId;
        if (category) filter.category = new RegExp(category, "i");
        if (inStock === "true") filter.stock = { $gt: 0 };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            populate: {
                path: "pharmacy",
                select: "name address phone location"
            },
            sort: { name: 1 }
        };

        const medicines = await Medicine.paginate(filter, options);

        res.status(200).json({
            medicines: medicines.docs,
            total: medicines.totalDocs,
            pages: medicines.totalPages,
            page: medicines.page,
            limit: medicines.limit
        });
    } catch (error) {
        console.error("Error fetching medicines:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Advanced search with filters (with pharmacy populate)
export const searchMedicines = async (req, res) => {
    try {
        const {
            name,
            location,
            pharmacyName,
            inStock,
            minPrice,
            maxPrice,
            category,
            page = 1,
            limit = 10
        } = req.query;

        // Filter pharmacies based on location or name
        let pharmacyFilter = {};
        if (location) pharmacyFilter.address = new RegExp(location, "i");
        if (pharmacyName) pharmacyFilter.name = new RegExp(pharmacyName, "i");

        const pharmacies = await Pharmacy.find(pharmacyFilter).select("_id");
        const pharmacyIds = pharmacies.map(p => p._id);

        // Build medicine filter
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

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            populate: {
                path: "pharmacy",
                select: "name address phone location"
            },
            sort: { name: 1 }
        };

        const medicines = await Medicine.paginate(medicineFilter, options);

        res.status(200).json({
            medicines: medicines.docs,
            total: medicines.totalDocs,
            pages: medicines.totalPages,
            page: medicines.page,
            limit: medicines.limit
        });
    } catch (error) {
        console.error("Error searching medicines:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Add a new medicine (auto populate pharmacy)
export const addMedicine = async (req, res) => {
    try {
        const { name, description, price, stock, category, pharmacyId } = req.body;

        if (!name || !price || !stock) {
            return res.status(400).json({ message: "Name, price, and stock are required" });
        }

        // Find pharmacy - use provided ID or user's default pharmacy
        let pharmacy;
        if (pharmacyId) {
            pharmacy = await Pharmacy.findById(pharmacyId);
        } else {
            pharmacy = await Pharmacy.findOne({ user: req.user._id });
        }

        if (!pharmacy) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }

        // Check if user owns the pharmacy
        if (pharmacy.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only add medicines to your own pharmacy" });
        }

        const medicine = new Medicine({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            pharmacy: pharmacy._id,
        });

        const savedMedicine = await medicine.save();
        await savedMedicine.populate("pharmacy", "name address phone location");

        res.status(201).json(savedMedicine);
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Update medicine (auto populate pharmacy)
export const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        // Get user's pharmacy
        const userPharmacy = await Pharmacy.findOne({ user: req.user._id });
        if (!userPharmacy) {
            return res.status(404).json({ message: "Your pharmacy not found" });
        }

        // Check if medicine belongs to user's pharmacy
        if (medicine.pharmacy.toString() !== userPharmacy._id.toString()) {
            return res.status(403).json({ message: "You can only update medicines from your own pharmacy" });
        }

        const updated = await Medicine.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate("pharmacy", "name address phone location");

        res.status(200).json(updated);
    } catch (error) {
        console.error("Error updating medicine:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Delete medicine
export const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        // Get user's pharmacy
        const userPharmacy = await Pharmacy.findOne({ user: req.user._id });
        if (!userPharmacy) {
            return res.status(404).json({ message: "Your pharmacy not found" });
        }

        // Check if medicine belongs to user's pharmacy
        if (medicine.pharmacy.toString() !== userPharmacy._id.toString()) {
            return res.status(403).json({ message: "You can only delete medicines from your own pharmacy" });
        }

        await Medicine.findByIdAndDelete(id);
        res.status(200).json({ message: "Medicine deleted successfully" });
    } catch (error) {
        console.error("Error deleting medicine:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
