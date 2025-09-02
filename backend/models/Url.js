import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
	shortId: { type: String, unique: true },
	longUrl: { type: String, required: true },
	clickCount: { type: Number, default: 0 },
	lastAccessed: { type: Date },
	referrers: { type: Map, of: Number, default: {} },
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
