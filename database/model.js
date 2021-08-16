import mongoose from "mongoose";
const urlSchema = new mongoose.Schema({
    user: { type: String },
    longurl: { type: String, required: true },
    shorturl: { type: String, required: true },
    urlcode: { type: String, required: true, unique: true },
    clicks: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now() }
})
const loginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
    resettoken: String,
    expiretoken: Date,
})
export const urlModel = mongoose.model("urlshort", urlSchema)
export const loginModel = mongoose.model("loginData", loginSchema)