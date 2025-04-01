import mongoose from "mongoose";

export default mongoose.model(
  "track",
  new mongoose.Schema({
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "reader", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    tag: { type: mongoose.Schema.Types.ObjectId, ref: "tag", required: true },
    timeIn: { type: Number, default: Date.now() },
    timeOut: { type: Number, default: null },
    status: { type: String, enum: ["present", "absent", "late", "early", "leave", "excused"], default: "present" },
    statusReason: { type: String, trim: true },
  }, { timestamps: true })
);