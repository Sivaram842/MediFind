import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import pharmacyRouter from "./routes/pharmacyRoutes.js";
import medicineRouter from "./routes/medicineRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// ✅ Allow multiple origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://medifindx.netlify.app",  // your production frontend
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// DB connection
connectDB();

// Routes
app.use("/api/users", userRouter);
app.use("/api/pharmacies", pharmacyRouter);
app.use("/api/medicines", medicineRouter);

app.get("/", (req, res) => {
    res.send("✅ MediFind API is working!");
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
