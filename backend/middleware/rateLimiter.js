// middlewares/rateLimiter.js

import dotenv from "dotenv";
dotenv.config();

import arcjet, { shield, tokenBucket } from "@arcjet/node";

// 🔍 Debug: log env values
console.log("ARCJET_ENV:", process.env.ARCJET_ENV);

const aj = arcjet({
	key: process.env.ARCJET_KEY,
	characteristics: ["ip.src"],
	rules: [
		shield({ mode: "LIVE" }),
		tokenBucket({
			mode: process.env.ARCJET_ENV === "development" ? "DRY_RUN" : "LIVE",
			refillRate: 10, // 10 request
			interval: 60, // per 60 seconds
			capacity: 1, // bucket size = 1
		}),
	],
});

export const rateLimiter = async (req, res, next) => {
	try {
		const decision = await aj.protect(req, { requested: 1 });
		console.log("Arcjet decision:", decision);

		if (decision.isDenied()) {
			return res.status(429).json({
				error: "Too many requests. Please try again later.",
			});
		}

		next();
	} catch (err) {
		console.error("RateLimiter error:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
