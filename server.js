import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import urlRoutes from "./routes/urlRoutes.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Apply Arcjet rate limiter
app.use(rateLimiter);

// ✅ MongoDB connection
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error(err));

// ✅ Routes
app.use("/", urlRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
