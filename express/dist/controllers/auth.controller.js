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
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.authenticateUser = authenticateUser;
const genericRes = __importStar(require("./generic.controller"));
const auth = __importStar(require("../configurations/auth.config"));
const user_model_1 = __importDefault(require("../models/user.model"));
async function loginUser(req, res) {
    var _a, _b, _c;
    try {
        // Check for mobile number and/or email
        const mobileNo = (_a = req.body.mobileNo) === null || _a === void 0 ? void 0 : _a.toString().trim();
        const email = (_b = req.body.email) === null || _b === void 0 ? void 0 : _b.toString().trim();
        const rawPassword = (_c = req.body.password) === null || _c === void 0 ? void 0 : _c.toString().trim();
        if (!mobileNo && !email)
            return genericRes.badRequest(req, res, "Must provide mobile number or email.");
        if (!rawPassword)
            return genericRes.badRequest(req, res, "Must provide password.");
        // Get the user
        let query = {};
        if (mobileNo)
            query = Object.assign(Object.assign({}, query), { mobileNo });
        if (email)
            query = Object.assign(Object.assign({}, query), { email });
        const user = await user_model_1.default.findOne(query);
        if (!user)
            throw Error("User not found!");
        if (user.suspended === true)
            throw Error("User is suspended! Contact support for more information. dev.smq@gmail.com");
        // Password-based auth
        if (user.verified === false)
            throw Error("User not verified! Complete the registration process first.");
        const isValid = await auth.isValidPassword(rawPassword, user.password);
        console.log(isValid, user.password, rawPassword);
        if (!isValid)
            throw Error("Invalid Credentials");
        const secret = auth.getSecret(user.mobileNo);
        return genericRes.successOk(req, res, { secret }, "Login successful!");
    }
    catch (error) {
        return genericRes.unauthorized(req, res, error.message);
    }
}
async function registerUser(req, res) {
    var _a, _b, _c, _d, _e, _f;
    try {
        // Ensure requirements
        const mobileNo = (_a = req.body.mobileNo) === null || _a === void 0 ? void 0 : _a.toString().trim();
        const email = (_b = req.body.email) === null || _b === void 0 ? void 0 : _b.toString().trim().toLowerCase();
        const name = (_c = req.body.name) === null || _c === void 0 ? void 0 : _c.toString().trim().toUpperCase();
        const rawPassword = (_d = req.body.password) === null || _d === void 0 ? void 0 : _d.toString().trim();
        const type = (_f = (_e = req.body.type) === null || _e === void 0 ? void 0 : _e.toString().trim().toLowerCase()) !== null && _f !== void 0 ? _f : "customer";
        if (!rawPassword)
            return genericRes.badRequest(req, res, "Must provide password.");
        if (type == "admin")
            return genericRes.unauthorized(req, res, "You can't register as admin.");
        const password = await auth.getPasswordHash(rawPassword);
        const userDetails = { type, mobileNo, email, name, password };
        // Check for duplicate verified user
        const duplicate = await user_model_1.default.findOne({ mobileNo: userDetails.mobileNo, verified: true });
        if (duplicate)
            return genericRes.forbidden(req, res, "A verified user with same mobile number already exists.");
        // Create user or update if already exists as unverified
        const newUser = await user_model_1.default.findOneAndUpdate({ mobileNo: userDetails.mobileNo }, userDetails, { new: true, upsert: true });
        if (!newUser)
            throw Error("Failed to create new user!");
        const sanitizedUser = Object.assign(Object.assign({}, newUser.toObject()), { password: "" });
        return genericRes.successOk(req, res, sanitizedUser, "Successfully registered user, verification pending!");
    }
    catch (error) {
        return genericRes.unauthorized(req, res, error.message);
    }
}
async function authenticateUser(req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        // Check for mobile number and/or email
        const mobileNo = (_a = req.body.mobileNo) === null || _a === void 0 ? void 0 : _a.toString().trim();
        const email = (_b = req.body.email) === null || _b === void 0 ? void 0 : _b.toString().trim();
        if (!mobileNo && !email)
            return genericRes.badRequest(req, res, "Must provide mobile number or email.");
        let query = {};
        if (mobileNo)
            query = Object.assign(Object.assign({}, query), { mobileNo });
        if (email)
            query = Object.assign(Object.assign({}, query), { email });
        // Get the user
        const user = await user_model_1.default.findOne(query);
        if (!user)
            throw Error("User not found!");
        if (user.suspended === true)
            throw Error("User is suspended! Contact support for more information. dev.smq@gmail.com");
        // Authenticate user by
        // 1. Validating tokenSMS -> otpSMS, and tokenMail -> otpMail
        //    For successful authentication, at least one of the two must be verified/reverified.
        // 2. Wile authentication, if got verified recently, add 100 credits to the user.
        // 3. Update user with verification status, credit, and last login time
        let isAuthenticated = false;
        const userStatus = { mobileNo: (_c = user.verifiedMobileNo) !== null && _c !== void 0 ? _c : false, email: (_d = user.verifiedEmail) !== null && _d !== void 0 ? _d : false };
        const tokenSMS = (_e = req.body.tokenSMS) === null || _e === void 0 ? void 0 : _e.toString().trim();
        const otpSMS = (_f = req.body.otpSMS) === null || _f === void 0 ? void 0 : _f.toString().trim();
        const tokenMail = (_g = req.body.tokenMail) === null || _g === void 0 ? void 0 : _g.toString().trim();
        const otpMail = (_h = req.body.otpMail) === null || _h === void 0 ? void 0 : _h.toString().trim();
        if (tokenSMS) {
            if (!auth.isValidToken(tokenSMS, user.mobileNo, +otpSMS, user.type))
                throw Error("Unmatched OTP for Mobile Number.");
            userStatus.mobileNo = true;
            isAuthenticated = true;
        }
        if (tokenMail) {
            if (!auth.isValidToken(tokenMail, user.mobileNo, +otpMail, user.type))
                throw Error("Unmatched OTP for Email Address.");
            userStatus.email = true;
            isAuthenticated = true;
        }
        if (!isAuthenticated)
            throw Error("Couldn't able to authenticate user!");
        // Update user with verification status, credit, and last login time
        let authenticatedUser = await user_model_1.default.findByIdAndUpdate(user._id, {
            verifiedEmail: userStatus.email,
            verifiedMobileNo: userStatus.mobileNo,
            verified: userStatus.email || userStatus.mobileNo,
            lastLogin: Date.now(),
        }, { new: true });
        if (!authenticatedUser)
            throw Error("Failed to authenticate user!");
        const secret = auth.getSecret(user.mobileNo);
        return genericRes.successOk(req, res, { secret }, "Authentication successful!");
    }
    catch (error) {
        return genericRes.unauthorized(req, res, error.message);
    }
}
