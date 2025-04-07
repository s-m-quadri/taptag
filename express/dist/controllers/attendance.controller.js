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
const crypto_1 = __importDefault(require("crypto"));
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
const reader_model_1 = __importDefault(require("../models/reader.model"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const track_model_1 = __importDefault(require("../models/track.model"));
const mongoose_1 = __importDefault(require("mongoose"));
async function getEntity(req, res) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const queryId = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString().trim();
        const queryDate = (_b = req.query.date) === null || _b === void 0 ? void 0 : _b.toString().trim();
        const queryTimeIn = parseInt(((_c = req.query.timeIn) === null || _c === void 0 ? void 0 : _c.toString().trim()) || "0", 10);
        const queryTimeOut = parseInt(((_d = req.query.timeOut) === null || _d === void 0 ? void 0 : _d.toString().trim()) || "0", 10);
        const queryReader = (_e = req.query.reader) === null || _e === void 0 ? void 0 : _e.toString().trim();
        const queryStudent = (_f = req.query.student) === null || _f === void 0 ? void 0 : _f.toString().trim();
        const queryReason = (_g = req.query.reason) === null || _g === void 0 ? void 0 : _g.toString().trim();
        let query = {};
        if (queryId)
            query = Object.assign(Object.assign({}, query), { _id: queryId });
        if (queryDate)
            query = Object.assign(Object.assign({}, query), { date: queryDate });
        if (queryTimeIn)
            query = Object.assign(Object.assign({}, query), { timeIn: { $gte: queryTimeIn } });
        if (queryTimeOut)
            query = Object.assign(Object.assign({}, query), { timeOut: { $lte: queryTimeOut } });
        if (queryReader)
            query = Object.assign(Object.assign({}, query), { reader: queryReader });
        if (queryStudent)
            query = Object.assign(Object.assign({}, query), { students: queryStudent });
        if (queryReason)
            query = Object.assign(Object.assign({}, query), { reason: queryReason });
        // Get all attendance records
        const allAttendance = await attendance_model_1.default.find(query).sort("date").populate("students", "-password -__v -createdAt -updatedAt").populate("reader", "-password -__v -createdAt -updatedAt");
        if (!allAttendance)
            return genericRes.badRequest(req, res, "Failed to get attendance records!");
        return genericRes.successOk(req, res, allAttendance, `Here are ${allAttendance.length} attendance records.`);
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
async function createEntity(req, res) {
    var _a, _b, _c;
    try {
        // Ensure requirements
        let date = new Date().toISOString().split("T")[0];
        let reader = (_a = req.body.reader) === null || _a === void 0 ? void 0 : _a.toString().trim();
        let studentsEncryptedRFIDs = req.body.students;
        let reason = (_b = req.body.reason) === null || _b === void 0 ? void 0 : _b.toString().trim().toLowerCase();
        let isOut = req.body.isOut || false;
        let notes = ((_c = req.body.notes) === null || _c === void 0 ? void 0 : _c.toString().trim()) || "";
        if (!reader)
            return genericRes.badRequest(req, res, "Invalid reader.");
        if (!studentsEncryptedRFIDs || studentsEncryptedRFIDs.length == 0)
            return genericRes.badRequest(req, res, "Must provide at least one student.");
        if (!reason)
            return genericRes.badRequest(req, res, "Invalid reason.");
        // Get secret key from reader
        const readerData = await reader_model_1.default.findById(reader);
        if (!readerData)
            return genericRes.badRequest(req, res, "Invalid reader.");
        const base64Key = readerData.secret;
        if (!base64Key)
            return genericRes.badRequest(req, res, "Invalid reader secret key.");
        const secretKey = Buffer.from(base64Key, 'base64');
        // Decrypt student RFIDs
        console.log("studentsEncryptedRFIDs:", studentsEncryptedRFIDs);
        console.log("base64Key:", base64Key);
        console.log("secretKey:", secretKey);
        const decryptedRFIDs = [];
        for (const base64Cipher of studentsEncryptedRFIDs) {
            try {
                const encryptedData = Buffer.from(base64Cipher, 'base64');
                const decipher = crypto_1.default.createDecipheriv('aes-256-ecb', secretKey, null);
                decipher.setAutoPadding(false);
                const decrypted = Buffer.concat([
                    decipher.update(encryptedData),
                    decipher.final()
                ]);
                const decryptedText = decrypted.toString('utf8').replace(/[^\x20-\x7E]+/g, '');
                console.log("Decrypted buffer (hex):", decryptedText);
                decryptedRFIDs.push(decryptedText);
            }
            catch (err) {
                console.error('Failed to decrypt RFID:', err);
                decryptedRFIDs.push('[DECRYPTION_FAILED]');
            }
        }
        console.log("decryptedRFIDs:", decryptedRFIDs);
        // Retrieve student data from decrypted RFIDs from tag model
        const tags = await tag_model_1.default.find({ tag: { $in: decryptedRFIDs } });
        if (!tags)
            return genericRes.badRequest(req, res, "Failed to get student data!");
        const students = tags.map(tag => tag.associated._id);
        if (!students || students.length == 0)
            return genericRes.badRequest(req, res, "Failed to get student data!");
        console.log("students: ", students);
        // Log into track model
        const track = await track_model_1.default.create({ students, tags: decryptedRFIDs });
        if (!track)
            return genericRes.badRequest(req, res, "Failed to log into track model!");
        // Check if attendance record already exists for the date, if yes append the students to the existing record
        const existingAttendance = await attendance_model_1.default.findOne({ date, reader, isOut });
        if (existingAttendance) {
            const existingIds = existingAttendance.students.map(id => id.toString());
            const incomingIds = students.map(id => id.toString());
            const uniqueIds = [...new Set([...existingIds, ...incomingIds])];
            existingAttendance.students = uniqueIds.map(id => new mongoose_1.default.Types.ObjectId(id));
            existingAttendance.reason = reason;
            existingAttendance.notes = notes;
            await existingAttendance.save();
            return genericRes.successOk(req, res, existingAttendance, "Updated attendance record successfully!");
        }
        // Create attendance record
        const newAttendance = await attendance_model_1.default.create({ date, reader, students, reason, isOut, notes, timeIn: isOut ? undefined : Date.now(), timeOut: isOut ? Date.now() : undefined, });
        if (!newAttendance)
            throw Error("Failed to create new attendance record!");
        return genericRes.successOk(req, res, newAttendance, "Added attendance record successfully!");
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
async function updateEntity(req, res) {
    try {
        return genericRes.internalServerError(req, res, "Not implemented yet!");
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
async function deleteEntity(req, res) {
    try {
        return genericRes.internalServerError(req, res, "Not implemented yet!");
    }
    catch (error) {
        return genericRes.badRequest(req, res, error.message, "Something went wrong!");
    }
}
