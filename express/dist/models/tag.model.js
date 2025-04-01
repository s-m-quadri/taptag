"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("tag", new mongoose_1.default.Schema({
    tag: { type: String, trim: true, required: true },
    associated: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true },
    validFrom: { type: Number, default: Date.now() },
    validTo: { type: Number, default: Date.now() + 31536000000 }, // 1 year in milliseconds
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    statusReason: { type: String, trim: true },
}, { timestamps: true }));
