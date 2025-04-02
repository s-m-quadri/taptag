"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = mongoose_1.default.model("access", new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true },
    reader: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "reader", required: true },
    note: { type: mongoose_1.default.Schema.Types.String, trim: true }
}, { timestamps: true }));
