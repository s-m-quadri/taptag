import mongoose from "mongoose";

export default mongoose.model(
  "reader",
  new mongoose.Schema({
    name: { type: String, trim: true, required: [true, "Name is required."] },
    isActive: { type: Boolean, default: true },
    description: { type: String, trim: true },

    // Credentials
    ssid: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    secret: { type: String, trim: true, required: true },
  }, { timestamps: true })
);