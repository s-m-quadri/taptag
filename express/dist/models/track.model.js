"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("track", new mongoose_1.default.Schema({
    timestamp: { type: Number, default: Date.now() },
    students: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true }],
    tags: { type: [String], required: true },
}, { timestamps: true }));
