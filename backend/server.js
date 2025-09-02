import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import urlRoutes from "./routes/urlRoutes.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
app.use(express.json());

// Apply Arcjet rate limiter
app.use(rateLimiter);
// Connect to MongoDB
connectDB();

//  Routes
app.use("/", urlRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
