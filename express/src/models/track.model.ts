import mongoose from "mongoose";

export default mongoose.model(
  "track",
  new mongoose.Schema({
    timestamp: { type: Number, default: Date.now() },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
    tags: { type: [String], required: true },
  }, { timestamps: true })
);