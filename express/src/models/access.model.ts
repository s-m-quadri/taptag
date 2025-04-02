import mongoose from "mongoose";

export default mongoose.model(
  "access",
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    reader: { type: mongoose.Schema.Types.ObjectId, ref: "reader", required: true },
    note: { type: mongoose.Schema.Types.String, trim: true }
  }, { timestamps: true })
);