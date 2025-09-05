import express from "express";
import {
    addPharmacy,
    getAllPharmacies,
    getPharmacyById,
    updatePharmacy,
    deletePharmacy,
    getMyPharmacy
} from "../controllers/pharmacyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { pharmacyOnly } from "../middleware/roleMiddleware.js";

const pharmacyRouter = express.Router();

// Public routes
pharmacyRouter.get("/", getAllPharmacies);

// 🔒 Get pharmacy for logged-in user
// Keep ONLY ONE of these (I suggest `/my-pharmacy`)
pharmacyRouter.get("/my-pharmacy", protect, getMyPharmacy);

// Public route - must come last after custom routes
pharmacyRouter.get("/:id", getPharmacyById);

// Protected (pharmacy-only) routes
pharmacyRouter.post("/", protect, pharmacyOnly, addPharmacy);
pharmacyRouter.put("/:id", protect, pharmacyOnly, updatePharmacy);
pharmacyRouter.delete("/:id", protect, pharmacyOnly, deletePharmacy);

export default pharmacyRouter;
