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
const tag_model_1 = __importDefault(require("../models/tag.model"));
async function getEntity(req, res) {
    var _a, _b, _c, _d;
    try {
        const queryId = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString().trim();
        const queryTag = (_b = req.query.tag) === null || _b === void 0 ? void 0 : _b.toString().trim();
        const queryStatus = (_c = req.query.status) === null || _c === void 0 ? void 0 : _c.toString().trim();
        const queryAssociated = (_d = req.query.associated) === null || _d === void 0 ? void 0 : _d.toString().trim();
        let query = {};
        if (queryId)
            query = Object.assign(Object.assign({}, query), { _id: queryId });
        if (queryTag)
            query = Object.assign(Object.assign({}, query), { tag: queryTag });
        if (queryStatus)
            query = Object.assign(Object.assign({}, query), { status: queryStatus });
        if (queryAssociated)
            query = Object.assign(Object.assign({}, query), { associated: queryAssociated });
        // Get all tags
        const allTags = await tag_model_1.default.find(query).sort("tag").select("-__v");
        if (!allTags)
            return genericRes.badRequest(req, res, "Failed to get tags.");
        return genericRes.successOk(req, res, allTags, `Here are ${allTags.length} tags.`);
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
async function createEntity(req, res) {
    var _a, _b;
    try {
        if (req.body.auth.user.type != "admin")
            return genericRes.unauthorized(req, res, "Only admin can register new readers.");
        // Ensure requirements and create tag
        let tag = (_a = req.body.tag) === null || _a === void 0 ? void 0 : _a.toString().trim();
        let associated = (_b = req.body.associated) === null || _b === void 0 ? void 0 : _b.toString().trim();
        if (!tag)
            return genericRes.badRequest(req, res, "Must provide tag.");
        if (!associated)
            return genericRes.badRequest(req, res, "Must provide associated.");
        // Create tag
        const newTag = await tag_model_1.default.create({ tag, associated, by: req.body.auth.user._id });
        if (!newTag)
            return genericRes.badRequest(req, res, "Failed to create tag.");
        return genericRes.successOk(req, res, newTag, "Added tag successfully!");
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
async function updateEntity(req, res) {
    var _a, _b;
    try {
        if (req.body.auth.user.type != "admin")
            return genericRes.unauthorized(req, res, "Only admin can register new readers.");
        // Ensure requirements
        const tag = (_a = req.body.tag) === null || _a === void 0 ? void 0 : _a.toString().trim();
        const associated = (_b = req.body.associated) === null || _b === void 0 ? void 0 : _b.toString().trim();
        const validTo = req.body.validTo;
        const status = req.body.status.trim();
        const statusReason = req.body.statusReason;
        if (!tag)
            return genericRes.badRequest(req, res, "Must provide tag ID.");
        // Update tag
        const newTag = await tag_model_1.default.findOneAndUpdate({ tag }, { validTo, status, statusReason, associated }, { new: true });
        if (!newTag)
            return genericRes.badRequest(req, res, "Failed to update tag.");
        return genericRes.successOk(req, res, newTag, "Updated tag successfully!");
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
async function deleteEntity(req, res) {
    var _a;
    try {
        if (req.body.auth.user.type != "admin")
            return genericRes.unauthorized(req, res, "Only admin can register new readers.");
        // Ensure requirements
        const tag = (_a = req.body.tag) === null || _a === void 0 ? void 0 : _a.toString().trim();
        if (!tag)
            return genericRes.badRequest(req, res, "Must provide tag ID.");
        // Delete tag
        const deletedTag = await tag_model_1.default.findOneAndDelete({ tag }, { new: true });
        if (!deletedTag)
            return genericRes.badRequest(req, res, "Failed to delete tag.");
        return genericRes.successOk(req, res, deletedTag, "Deleted tag successfully!");
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
