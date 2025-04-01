"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("reader", new mongoose_1.default.Schema({
    name: { type: String, trim: true, required: true },
    isActive: { type: Boolean, default: true },
    description: { type: String, trim: true },
    // Credentials
    deviceId: { type: String, trim: true, required: true },
    secret: { type: String, trim: true, required: true },
    ssid: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
}, { timestamps: true }));
