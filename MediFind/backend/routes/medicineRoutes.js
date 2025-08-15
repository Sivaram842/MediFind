import express from "express";
import {
    addMedicine,
    getAllMedicines,
    searchMedicines,
    updateMedicine,
    deleteMedicine
} from "../controllers/medicineController.js";
import { protect } from "../middleware/authMiddleware.js";
import { pharmacyOnly } from "../middleware/roleMiddleware.js";  // ✅ import

const medicineRouter = express.Router();

// Public routes
medicineRouter.get("/", getAllMedicines);
medicineRouter.get("/search", searchMedicines);

// Protected routes — Only pharmacy admins
medicineRouter.post("/", protect, pharmacyOnly, addMedicine);
medicineRouter.put("/:id", protect, pharmacyOnly, updateMedicine);
medicineRouter.delete("/:id", protect, pharmacyOnly, deleteMedicine);

export default medicineRouter;
