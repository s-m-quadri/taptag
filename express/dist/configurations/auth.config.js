"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rate3per5min = exports.rate15per1min = exports.rate6per2min = exports.rate1per1min = void 0;
exports.getOTP = getOTP;
exports.getPhrase = getPhrase;
exports.getHash = getHash;
exports.getToken = getToken;
exports.createToken = createToken;
exports.isValidToken = isValidToken;
exports.getSecret = getSecret;
exports.getPasswordHash = getPasswordHash;
exports.isValidPassword = isValidPassword;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const genericRes = __importStar(require("../controllers/generic.controller"));
const env_config_1 = __importDefault(require("../configurations/env.config"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const OTP_TIMEOUT = 60 * 60 * 1000;
exports.rate1per1min = (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, limit: 1, handler: (req, res, next, options) => genericRes.tooManyRequest(req, res) });
exports.rate6per2min = (0, express_rate_limit_1.default)({ windowMs: 120 * 1000, limit: 6, handler: (req, res, next, options) => genericRes.tooManyRequest(req, res) });
exports.rate15per1min = (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, limit: 15, handler: (req, res, next, options) => genericRes.tooManyRequest(req, res) });
exports.rate3per5min = (0, express_rate_limit_1.default)({ windowMs: 5 * 60 * 1000, limit: 3, handler: (req, res, next, options) => genericRes.tooManyRequest(req, res) });
function getOTP() {
    let otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}
function getPhrase(mobileNo, otp, type, expires) {
    return `${mobileNo}.${otp}.${type}.${expires}`;
}
function getHash(phrase) {
    return crypto_1.default.createHmac("sha256", env_config_1.default.SECRET).update(phrase).digest("hex");
}
function getToken(mobileNo, otp, type, expires) {
    return `${getHash(getPhrase(mobileNo, otp, type, expires))}.${expires}`;
}
function createToken(mobileNo, otp, type) {
    let expires = Date.now() + OTP_TIMEOUT;
    return getToken(mobileNo, otp, type, expires);
}
function isValidToken(token, mobileNo, otp, type) {
    const [_, expires] = token.split(".");
    if (Date.now() > +expires)
        throw Error("Token is expired!");
    return token === getToken(mobileNo, otp, type, +expires);
}
function getSecret(mobileNo) {
    return jwt.sign({ "mobileNo": mobileNo }, env_config_1.default.JWT_SECRET, { expiresIn: "1y" });
}
async function getPasswordHash(password) {
    try {
        return await bcrypt_1.default.hash(password, 10);
    }
    catch (error) {
        throw Error("Something went wrong in hashing.");
    }
}
async function isValidPassword(password, hash) {
    try {
        return await bcrypt_1.default.compare(password, hash);
    }
    catch (error) {
        throw Error("Something went wrong in hash matching.");
    }
}
