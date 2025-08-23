import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
	shortId: { type: String, unique: true },
	longUrl: { type: String, required: true },
	analytics: {
		clickCount: { type: Number, default: 0 },
		lastAccessed: { type: Date, default: null },
		referrers: { type: [String], default: [] },
	},
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
