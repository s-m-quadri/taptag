import mongoose from "mongoose";

export default mongoose.model(
  "attendance",
  new mongoose.Schema({
    date: { type: String, required: true, trim: true },
    isOut: { type: Boolean, default: false },
    timeIn: { type: Number, default: Date.now() },
    timeOut: { type: Number, default: Date.now() + 28800000 },
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "reader", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
    reason: { type: String, enum: ["lecture", "lab", "exam", "seminar", "workshop", "extracurricular", "general"], default: "general" },
    notes: { type: String, trim: true },
  }, { timestamps: true })
);