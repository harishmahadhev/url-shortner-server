import mongoose from "mongoose";
const urlSchema = new mongoose.Schema({
    longurl: { type: String, required: true },
    shorturl: { type: String, required: true },
    urlcode: { type: String, required: true, unique: true },
    clicks: { type: Number, required: true, default: 0 },
    date: { type: String, default: Date.now }
})
export const urlModel = mongoose.model("urlshort", urlSchema)