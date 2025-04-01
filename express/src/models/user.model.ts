import mongoose from "mongoose";;

export default mongoose.model(
  "user",
  new mongoose.Schema({
    type: { type: String, required: true, enum: ["admin", "student", "teacher", "parent", "other"], default: "other", },
    mobileNo: { type: String, trim: true, unique: true, required: true, regex: /^[0-9]{10}$/, },

    password: { type: String, trim: true, required: true, },
    name: { type: String, trim: true, required: true, regex: /^[a-zA-Z ]+$/, },
    email: { type: String, trim: true, required: true, regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, },
    img: { type: String, default: null, },

    verifiedMobileNo: { type: Boolean, default: false, },
    verifiedEmail: { type: Boolean, default: false, },
    verified: { type: Boolean, default: false, },
    suspended: { type: Boolean, default: false, },

    lastLogin: { type: Number, default: Date.now(), },
  }, { timestamps: true })
);