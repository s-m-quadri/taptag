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
const genericRes = __importStar(require("./generic.controller"));
const reader_model_1 = __importDefault(require("../models/reader.model"));
const access_model_1 = __importDefault(require("../models/access.model"));
const uuid_1 = require("uuid");
const excludeSensitiveFields = "-secret -__v -createdAt -updatedAt";
async function getEntity(req, res) {
    var _a, _b, _c;
    try {
        // Non admin user can only query limited
        if (req.body.auth.user.type != "admin") {
            let ssid = (_a = req.query.ssid) === null || _a === void 0 ? void 0 : _a.toString().trim();
            if (!ssid)
                return genericRes.badRequest(req, res, "Must provide device id.");
            // Get reader and return
            const reader = await reader_model_1.default.findOne({ ssid }).select(excludeSensitiveFields);
            if (!reader)
                return genericRes.badRequest(req, res, "Reader not found!");
            const log = await access_model_1.default.create({ user: req.body.auth.user._id, reader: reader._id });
            if (!log)
                return genericRes.forbidden(req, res, "Security failed to log access.");
            return genericRes.successOk(req, res, reader, `Here is a reader associated with ${ssid}.`);
        }
        // Admin user can query by id, mobileNo, type
        let id = (_b = req.query.id) === null || _b === void 0 ? void 0 : _b.toString().trim();
        let ssid = (_c = req.query.ssid) === null || _c === void 0 ? void 0 : _c.toString().trim();
        let query = {};
        if (id)
            query = Object.assign(Object.assign({}, query), { _id: id });
        if (ssid)
            query = Object.assign(Object.assign({}, query), { ssid });
        const allReaders = await reader_model_1.default.find(query).sort("name").select(excludeSensitiveFields);
        return genericRes.successOk(req, res, allReaders, `Here are ${allReaders.length} readers.`);
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
async function createEntity(req, res) {
    var _a, _b;
    if (req.body.auth.user.type != "admin")
        return genericRes.unauthorized(req, res, "Only admin can register new readers.");
    // Ensure requirements and create reader
    let name = (_a = req.body.name) === null || _a === void 0 ? void 0 : _a.toString().trim().toUpperCase();
    let description = (_b = req.body.description) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const newReader = await reader_model_1.default.create({
        name,
        description,
        ssid: `RFID-${Math.random().toString(36).substring(2, 14).toUpperCase()}`,
        password: (0, uuid_1.v4)(),
        secret: (0, uuid_1.v4)(),
    });
    if (!newReader)
        return genericRes.badRequest(req, res, "Failed to create reader.");
    return genericRes.successOk(req, res, newReader, "Added reader successfully!");
}
async function updateEntity(req, res) {
    var _a, _b;
    if (req.body.auth.user.type != "admin")
        return genericRes.unauthorized(req, res, "Only admin can update reader.");
    // Ensure requirements
    let ssid = (_a = req.body.ssid) === null || _a === void 0 ? void 0 : _a.toString().trim();
    if (!ssid)
        return genericRes.badRequest(req, res, "Must provide device id.");
    let isActive = (_b = req.body.isActive) !== null && _b !== void 0 ? _b : true;
    // Update isActive status
    const updatedReader = await reader_model_1.default.findOneAndUpdate({ ssid }, { isActive }, { new: true });
    if (!updatedReader)
        return genericRes.badRequest(req, res, "Failed to update reader.");
    return genericRes.successOk(req, res, updatedReader, "Updated reader successfully!");
}
