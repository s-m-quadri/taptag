import mongoose from "mongoose";

export default mongoose.model(
  "attendance",
  new mongoose.Schema({
    date: { type: Number, default: Date.now() },
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "reader", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
    reason: { type: String, enum: ["lecture", "lab", "exam", "seminar", "workshop", "extracurricular", "general"], default: "general" },
    notes: { type: String, trim: true },
  }, { timestamps: true })
);