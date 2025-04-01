"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEBUG = void 0;
exports.DEBUG = process.env.DEBUG != undefined;
const dotenv_1 = __importDefault(require("dotenv"));
let env = {};
try {
    // Load environment variables
    if (exports.DEBUG) {
        const result = dotenv_1.default.config();
        if (result.error)
            throw result.error;
    }
    // Retrieve all variables
    env = Object.assign(Object.assign({}, env), { PORT: Number(process.env.PORT) || 8080, ENV: exports.DEBUG ? "development" : "production", ATLAS: process.env.ATLAS, SECRET: process.env.SECRET, JWT_SECRET: process.env.JWT_SECRET });
    for (const key in env) {
        if (!env[key])
            throw Error(`Must have ${key} in environment!`);
    }
}
catch (error) {
    console.error("[error] Failed to load environment variables. Error:", error.message);
    process.exit(1);
}
exports.default = env;
