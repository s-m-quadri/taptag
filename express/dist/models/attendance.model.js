"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("attendance", new mongoose_1.default.Schema({
    date: { type: String, required: true, trim: true },
    isOut: { type: Boolean, default: false },
    timeIn: { type: Number, default: Date.now() },
    timeOut: { type: Number, default: Date.now() + 28800000 },
    reader: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "reader", required: true },
    students: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true }],
    reason: { type: String, enum: ["lecture", "lab", "exam", "seminar", "workshop", "extracurricular", "general"], default: "general" },
    notes: { type: String, trim: true },
}, { timestamps: true }));
