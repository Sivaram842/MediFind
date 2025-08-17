import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import pharmacyRouter from "./routes/pharmacyRoutes.js";
import medicineRouter from "./routes/medicineRoutes.js";

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Allow CORS only from your frontend (for security in production)
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*", // e.g., "https://medifind.netlify.app"
        credentials: true,
    })
);

// DB connection
connectDB();

// API endpoints
app.use("/api/users", userRouter);
app.use("/api/pharmacies", pharmacyRouter);
app.use("/api/medicines", medicineRouter);

// Default route
app.get("/", (req, res) => {
    res.send("✅ MediFind API is working!");
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
