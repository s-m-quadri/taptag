"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
exports.default = mongoose_1.default.model("user", new mongoose_1.default.Schema({
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
}, { timestamps: true }));
