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
exports.isAuthorized = isAuthorized;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genericRes = __importStar(require("../controllers/generic.controller"));
const env_config_1 = __importStar(require("../configurations/env.config"));
const user_model_1 = __importDefault(require("../models/user.model"));
async function isAuthorized(req, res, next) {
    try {
        // Ensure requirements
        let token = "";
        if (req.headers.token)
            token = req.headers.token;
        if (req.headers.authorization)
            token = req.headers.authorization;
        if (!token)
            return genericRes.unauthorized(req, res, "No token provided");
        // Decode and validate token
        let decoded = jsonwebtoken_1.default.verify(token, env_config_1.default.JWT_SECRET);
        let mobileNo = decoded.mobileNo;
        // Get the user
        const userModel = user_model_1.default;
        let user = await userModel.findOne({ mobileNo });
        if (env_config_1.DEBUG)
            console.log("[auth.middleware] Spotted user:", user === null || user === void 0 ? void 0 : user.type, user);
        if (!user)
            return genericRes.unauthorized(req, res, "No user exists");
        // Check for verifications and activation
        if (!user.verified)
            return genericRes.unauthorized(req, res, "User is not verified, please verify or re-register your account!");
        if (user.suspended)
            return genericRes.unauthorized(req, res, "User is suspended!");
        // TODO: check if user.activated
        // Exclude sensitive information and pass the user to the next middleware as auth
        let sanitizedUser = user.toObject();
        sanitizedUser = Object.assign(Object.assign({}, sanitizedUser), { password: "" });
        req.body = Object.assign(Object.assign({}, req.body), { auth: { user: sanitizedUser } });
        return next();
    }
    catch (err) {
        if (err.name === "JsonWebTokenError")
            return genericRes.unauthorized(req, res, "Invalid token spotted in the middleware.");
        return genericRes.unauthorized(req, res, "Authorization failed in the middleware.");
    }
}
;
