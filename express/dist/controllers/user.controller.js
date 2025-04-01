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
exports.getEntity = getEntity;
exports.createEntity = createEntity;
exports.updateEntity = updateEntity;
exports.deleteEntity = deleteEntity;
const genericRes = __importStar(require("./generic.controller"));
const auth = __importStar(require("../configurations/auth.config"));
const user_model_1 = __importDefault(require("../models/user.model"));
const excludeSensitiveFields = "-password -__v -createdAt -updatedAt";
async function getEntity(req, res) {
    var _a, _b, _c;
    try {
        // Non admin user can only query itself
        if (req.body.auth.user.type != "admin")
            return genericRes.successOk(req, res, req.body.auth.user, "This is the logged in user.");
        // Admin user can query by id, mobileNo, type
        let queryId = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString().trim();
        let queryMobileNo = (_b = req.query.mobileNo) === null || _b === void 0 ? void 0 : _b.toString().trim();
        let queryType = (_c = req.query.type) === null || _c === void 0 ? void 0 : _c.toString().trim().toLowerCase();
        let queryDb = {};
        if (queryId)
            queryDb = Object.assign(Object.assign({}, queryDb), { _id: queryId });
        if (queryMobileNo)
            queryDb = Object.assign(Object.assign({}, queryDb), { mobileNo: queryMobileNo });
        if (queryType)
            queryDb = Object.assign(Object.assign({}, queryDb), { type: queryType });
        const allUsers = await user_model_1.default.find(queryDb).sort("name").select(excludeSensitiveFields);
        return genericRes.successOk(req, res, allUsers, `Here are ${allUsers.length} ${queryType ? queryType : "user"}s.`);
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
async function createEntity(req, res) {
    var _a, _b, _c, _d, _e, _f;
    if (req.body.auth.user.type != "admin")
        return genericRes.unauthorized(req, res, "Only admin can create new users.");
    // Ensure requirements
    let mobileNo = (_a = req.body.mobileNo) === null || _a === void 0 ? void 0 : _a.toString().trim();
    let name = (_b = req.body.name) === null || _b === void 0 ? void 0 : _b.toString().trim();
    let email = (_c = req.body.email) === null || _c === void 0 ? void 0 : _c.toString().trim();
    let rawPassword = (_d = req.body.password) === null || _d === void 0 ? void 0 : _d.toString().trim();
    let type = (_e = req.body.type) === null || _e === void 0 ? void 0 : _e.toString().trim().toLowerCase();
    let isVerified = (_f = req.body.verified) !== null && _f !== void 0 ? _f : false;
    if (!mobileNo)
        return genericRes.badRequest(req, res, "Invalid mobile number.");
    if (!name)
        return genericRes.badRequest(req, res, "Must provide name.");
    if (!email)
        return genericRes.badRequest(req, res, "Invalid email.");
    if (!rawPassword)
        return genericRes.badRequest(req, res, "Must provide password.");
    if (!type)
        return genericRes.badRequest(req, res, "Invalid user type.");
    if (type == "admin")
        return genericRes.badRequest(req, res, "Cannot create user type as admin.");
    // Form new user data
    let password = await auth.getPasswordHash(rawPassword);
    let newUserData = { mobileNo, name, email, password, type, verified: isVerified };
    // Check for duplicate verified user
    const duplicate = await user_model_1.default.findOne({ mobileNo, verified: true });
    if (duplicate)
        return genericRes.forbidden(req, res, "A verified user with same mobile number already exists.");
    // Create user or update if already exists as unverified
    const newUser = await user_model_1.default.findOneAndUpdate({ mobileNo: mobileNo }, newUserData, { new: true, upsert: true });
    if (!newUser)
        throw Error("Failed to create new user!");
    let sanitizedUser = newUser.toObject();
    sanitizedUser = Object.assign(Object.assign({}, sanitizedUser), { password: "" });
    return genericRes.successOk(req, res, sanitizedUser, "Added user successfully!");
}
async function updateEntity(req, res) {
    var _a, _b, _c, _d, _e;
    // Ensure requirements
    // TO_OPTIMIZE: Shift validations to the model
    let name = (_a = req.body.name) === null || _a === void 0 ? void 0 : _a.toString().trim();
    let email = (_b = req.body.email) === null || _b === void 0 ? void 0 : _b.toString().trim();
    let rawPassword = (_c = req.body.password) === null || _c === void 0 ? void 0 : _c.toString().trim();
    let type = (_d = req.body.type) === null || _d === void 0 ? void 0 : _d.toString().trim().toLowerCase();
    let image = (_e = req.body.image) === null || _e === void 0 ? void 0 : _e.toString().trim();
    if (!name)
        return genericRes.badRequest(req, res, "Must provide name.");
    if (!email)
        return genericRes.badRequest(req, res, "Invalid email.");
    if (!rawPassword)
        return genericRes.badRequest(req, res, "Must provide password.");
    if (!type)
        return genericRes.badRequest(req, res, "Invalid user type.");
    if (type == "admin")
        return genericRes.badRequest(req, res, "Cannot update user type to admin.");
    // Form new user data
    let password = await auth.getPasswordHash(rawPassword);
    let newUserData = { name, email, password, image, type };
    // Admin can update any user by providing id
    const user = req.body.auth.user;
    if (user.type == "admin") {
        let queryId = req.query.id;
        if (!queryId)
            return genericRes.badRequest(req, res, "Must provide user id.");
        let updatedUser = await user_model_1.default.findByIdAndUpdate(queryId, newUserData, { new: true }).select(excludeSensitiveFields);
        if (!updatedUser)
            return genericRes.badRequest(req, res, "Failed to update user.");
        return genericRes.successOk(req, res, updatedUser, "Updated user successfully!");
    }
    // Non admin users can only update themselves
    let updatedUser = await user_model_1.default.findByIdAndUpdate(user._id, newUserData, { new: true }).select(excludeSensitiveFields);
    if (!updatedUser)
        return genericRes.badRequest(req, res, "Failed to update user.");
    return genericRes.successOk(req, res, updatedUser, "Updated user successfully!");
}
async function deleteEntity(req, res) {
    // Admin can delete any user by providing id
    const user = req.body.auth.user;
    if (user.type == "admin") {
        let queryId = req.query.id;
        if (!queryId)
            return genericRes.badRequest(req, res, "Must provide user id.");
        let deletedUser = await user_model_1.default.findByIdAndDelete(queryId).select(excludeSensitiveFields);
        if (!deletedUser)
            return genericRes.badRequest(req, res, "Failed to delete user.");
        return genericRes.successOk(req, res, deletedUser, "Deleted user successfully!");
    }
    // Non admin users can only delete themselves i.e. suspend instead of delete
    let suspendedUser = await user_model_1.default.findByIdAndUpdate(user._id, { suspended: true }, { new: true }).select(excludeSensitiveFields);
    if (!suspendedUser)
        return genericRes.badRequest(req, res, "Failed to suspend user.");
    return genericRes.successOk(req, res, suspendedUser, "Suspended user successfully!");
}
