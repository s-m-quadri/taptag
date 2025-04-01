"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = __importDefault(require("./env.config"));
async function connectDB() {
    try {
        await mongoose_1.default.connect(env_config_1.default.ATLAS);
        console.info("[success] Connected to Atlas database server.");
    }
    catch (error) {
        console.error("[error] Failed to connect to Atlas database server. Error:", error.message);
        process.exit(2);
    }
}
