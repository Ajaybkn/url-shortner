import Url from "../models/Url.js";
import { nanoid } from "nanoid";

// POST /shorten
export const shortenUrl = async (req, res) => {
	try {
		const { longUrl } = req.body;

		// check if same URL already exists
		let existing = await Url.findOne({ longUrl });
		if (existing) {
			return res.json({
				shortUrl: `${req.protocol}://${req.get("host")}/${existing.shortId}`,
				longUrl: existing.longUrl,
			});
		}

		// create new shortId
		const shortId = nanoid(9);

		const newUrl = await Url.create({
			longUrl,
			shortId,
			analytics: {
				clickCount: 0,
				lastAccessed: null,
				referrers: [],
			},
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

		// update analytics
		urlDoc.analytics.clickCount += 1;
		urlDoc.analytics.lastAccessed = new Date();
		const referrer = req.get("referer") || "direct";
		urlDoc.analytics.referrers.push(referrer);

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

		// top 5 referrers
		const refCount = {};
		urlDoc.analytics.referrers.forEach((r) => {
			refCount[r] = (refCount[r] || 0) + 1;
		});

		const topReferrers = Object.entries(refCount)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([ref]) => ref);

		res.json({
			clickCount: urlDoc?.analytics?.clickCount,
			lastAccessed: urlDoc.analytics.lastAccessed,
			topReferrers,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
