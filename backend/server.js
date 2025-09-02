import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import urlRoutes from "./routes/urlRoutes.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import connectDB from "./config/db.js";
const __dirname = path.resolve();
dotenv.config();
const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		credentials: true,
	})
);
// Apply Arcjet rate limiter
app.use(rateLimiter);
// Connect to MongoDB
connectDB();

//  Routes
app.use("/", urlRoutes);
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get(/^(?!\/api).*/, (req, res) => {
	res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
