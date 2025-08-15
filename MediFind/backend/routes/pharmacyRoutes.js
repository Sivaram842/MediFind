import express from "express";
import {
    addPharmacy,
    getAllPharmacies,
    getPharmacyById,
    updatePharmacy,
    deletePharmacy
} from "../controllers/pharmacyController.js";
import Pharmacy from "../models/pharmacy.js";
import { protect } from "../middleware/authMiddleware.js";
import { pharmacyOnly } from "../middleware/roleMiddleware.js";

const pharmacyRouter = express.Router();

// Public
pharmacyRouter.get("/", getAllPharmacies);

// ✅ /me must be placed before "/:id" to avoid conflicts
pharmacyRouter.get("/me", protect, pharmacyOnly, async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findOne({ user: req.user._id });
        if (!pharmacy) {
            return res.status(404).json({ message: "No pharmacy linked to this account" });
        }
        res.status(200).json(pharmacy);
    } catch (error) {
        console.error("Error fetching pharmacy info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Public route
pharmacyRouter.get("/:id", getPharmacyById);

// Protected (pharmacy-only) routes
pharmacyRouter.post("/", protect, pharmacyOnly, addPharmacy);
pharmacyRouter.put("/:id", protect, pharmacyOnly, updatePharmacy);
pharmacyRouter.delete("/:id", protect, pharmacyOnly, deletePharmacy);

export default pharmacyRouter;
