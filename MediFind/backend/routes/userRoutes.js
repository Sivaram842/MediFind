import express from "express";
import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { registerValidation, loginValidation } from "../validators/userValidator.js";
import { validate } from "../middleware/validate.js";

const userRouter = express.Router();


userRouter.post("/register", registerValidation, validate, registerUser);
userRouter.post("/login", loginValidation, validate, loginUser);

userRouter.get("/me", protect, (req, res) => {
    res.json(req.user); // Comes from authMiddleware
});


// ✅ Profile route (matches frontend expectation)
userRouter.get("/profile", protect, (req, res) => {
    res.json(req.user); // Comes from authMiddleware
});

// Protected routes (require token)
userRouter.get("/", protect, getAllUsers);      // Get all users
userRouter.get("/:id", protect, getUserById);   // Get user by ID
userRouter.put("/:id", protect, updateUser);    // Update user
userRouter.delete("/:id", protect, deleteUser); // Delete user

export default userRouter;
