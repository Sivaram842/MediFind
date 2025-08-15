import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import pharmacyRouter from "./routes/pharmacyRoutes.js";
import medicineRouter from "./routes/medicineRoutes.js";
import dotenv from "dotenv";
dotenv.config();







// app config
const app = express()
const port = process.env.PORT || 4000;

//middleware

app.use(express.json())
app.use(cors())

//db connection

connectDB();

//api endpoints

app.use("/api/users", userRouter)
app.use("/api/pharmacies", pharmacyRouter)
app.use("/api/medicines", medicineRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})

// mongodb+srv://sivaramp842:9032488161@cluster0.mlamomd.mongodb.net/?