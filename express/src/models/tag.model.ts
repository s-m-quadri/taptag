import mongoose from "mongoose";

export default mongoose.model(
  "tag",
  new mongoose.Schema({
    tag: { type: String, trim: true, required: true },
    associated: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    validFrom: { type: Number, default: Date.now() },
    validTo: { type: Number, default: Date.now() + 31536000000 }, // 1 year in milliseconds
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    statusReason: { type: String, trim: true },
  }, { timestamps: true })
);
