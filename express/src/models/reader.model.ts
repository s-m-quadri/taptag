import mongoose from "mongoose";

export default mongoose.model(
  "reader",
  new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    isActive: { type: Boolean, default: true },
    description: { type: String, trim: true },

    // Credentials
    deviceId: { type: String, trim: true, required: true },
    secret: { type: String, trim: true, required: true },
    ssid: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
  }, { timestamps: true })
);