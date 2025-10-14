import express from "express";
import {
    addMedicine,
    getAllMedicines,
    searchMedicines,
    updateMedicine,
    deleteMedicine,
    getMedicineById,
    getMedicinesByPharmacy
} from "../controllers/medicineController.js";
import { protect } from "../middleware/authMiddleware.js";
import { pharmacyOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ------------------------
// Public Routes
// ------------------------
router.get("/", getAllMedicines);                     // Get all medicines with optional filters
router.get("/search", searchMedicines);
router.get("/pharmacy/:pharmacyId", getMedicinesByPharmacy); // Get medicines by pharmacy ID
router.get("/:id", getMedicineById);                 // Get medicine by ID

// ------------------------
// Protected Routes
// ------------------------
router.use(protect); // All routes below require authentication

// Pharmacy-only routes
router.post("/", pharmacyOnly, addMedicine);         // Add new medicine
router.put("/:id", pharmacyOnly, updateMedicine);   // Update medicine
router.delete("/:id", pharmacyOnly, deleteMedicine); // Delete medicine

export default router;
