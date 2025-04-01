"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("track", new mongoose_1.default.Schema({
    reader: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "reader", required: true },
    student: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true },
    tag: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "tag", required: true },
    timeIn: { type: Number, default: Date.now() },
    timeOut: { type: Number, default: null },
    status: { type: String, enum: ["present", "absent", "late", "early", "leave", "excused"], default: "present" },
    statusReason: { type: String, trim: true },
}, { timestamps: true }));
