import Counter from "../models/Counter.js";
import Url from "../models/Url.js";

import { base62Encode } from "../utils/base62.js";

// POST /shorten
export const shortenUrl = async (req, res) => {
	try {
		const { longUrl } = req.body;

		// Check if the same URL already exists
		let existing = await Url.findOne({ longUrl });
		if (existing) {
			return res.json({
				shortUrl: `${req.protocol}://${req.get("host")}/${existing.shortId}`,
				longUrl: existing.longUrl,
			});
		}

		// Get the next counter value atomically
		const counterDoc = await Counter.findByIdAndUpdate(
			{ _id: "url_counter" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);

		// Generate shortId from the counter value
		const shortId = base62Encode(counterDoc.seq);

		const newUrl = await Url.create({
			longUrl,
			shortId,
			clickCount: 0,
			lastAccessed: null,
			referrers: {},
		});

		res.json({
			shortUrl: `${req.protocol}://${req.get("host")}/${shortId}`,
			longUrl: newUrl.longUrl,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// GET /:shortId → redirect
// GET /:shortId → redirect
export const redirectUrl = async (req, res) => {
	try {
		const { shortId } = req.params;
		const urlDoc = await Url.findOne({ shortId });

		if (!urlDoc) return res.status(404).json({ error: "URL not found" });

		// Update analytics
		urlDoc.clickCount += 1;
		urlDoc.lastAccessed = new Date();

		const referrer = req.get("referer") || "direct";
		urlDoc.referrers.set(referrer, (urlDoc.referrers.get(referrer) || 0) + 1);

		await urlDoc.save();

		res.redirect(urlDoc.longUrl);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// GET /stats/:shortId → stats
export const getStats = async (req, res) => {
	try {
		const { shortId } = req.params;
		const urlDoc = await Url.findOne({ shortId });

		if (!urlDoc) return res.status(404).json({ error: "URL not found" });

		// Convert referrers map to array and get top 5
		const refCount = Object.fromEntries(urlDoc.referrers);
		const topReferrers = Object.entries(refCount)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([ref]) => ref);

		res.json({
			clickCount: urlDoc.clickCount,
			lastAccessed: urlDoc.lastAccessed,
			topReferrers,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
