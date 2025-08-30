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

const medicineRouter = express.Router();

// Public routes
medicineRouter.get("/", getAllMedicines);
medicineRouter.get("/search", searchMedicines);
medicineRouter.get("/:id", getMedicineById);
medicineRouter.get("/pharmacy/:pharmacyId", getMedicinesByPharmacy);

// Protected routes — Only authenticated users
medicineRouter.use(protect);

// Pharmacy-only routes
medicineRouter.post("/", pharmacyOnly, addMedicine);
medicineRouter.put("/:id", pharmacyOnly, updateMedicine);
medicineRouter.delete("/:id", pharmacyOnly, deleteMedicine);

// Admin-only routes (if needed)
// medicineRouter.get("/admin/stats", adminOnly, getMedicineStats);

export default medicineRouter;