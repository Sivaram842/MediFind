import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists and is in correct format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user (excluding password) to the request
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next(); // ✅ Proceed to route/controller
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
