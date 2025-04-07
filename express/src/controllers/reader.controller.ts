import express from "express";
import * as genericRes from "./generic.controller";
import ReaderModel from "../models/reader.model";
import AccessLogModel from "../models/access.model";
import { v4 as uuidv4 } from "uuid";
import crypto from 'crypto';

const excludeSensitiveFields = "-secret -__v -createdAt -updatedAt";

export async function getEntity(req: express.Request, res: express.Response) {
  try {
    // Non admin user can only query limited
    if (req.body.auth.user.type != "admin") {
      let ssid = req.query.ssid?.toString().trim();
      if (!ssid) return genericRes.badRequest(req, res, "Must provide device id.");

      // Get reader and return
      const reader = await ReaderModel.findOne({ ssid }).select(excludeSensitiveFields);
      if (!reader) return genericRes.badRequest(req, res, "Reader not found!");
      const log = await AccessLogModel.create({ user: req.body.auth.user._id, reader: reader._id });
      if (!log) return genericRes.forbidden(req, res, "Security failed to log access.");
      return genericRes.successOk(req, res, reader, `Here is a reader associated with ${ssid}.`)
    }

    // Admin user can query by id, mobileNo, type
    let id = req.query.id?.toString().trim();
    let ssid = req.query.ssid?.toString().trim();
    let query = {};
    if (id) query = { ...query, _id: id };
    if (ssid) query = { ...query, ssid };
    const allReaders = await ReaderModel.find(query).sort("name").select(excludeSensitiveFields);
    return genericRes.successOk(req, res, allReaders, `Here are ${allReaders.length} readers.`);
  } catch (error) {
    return genericRes.badRequest(req, res, (error as Error).message, "Something went wrong!");
  }
}

export async function createEntity(req: express.Request, res: express.Response) {
  if (req.body.auth.user.type != "admin") return genericRes.unauthorized(req, res, "Only admin can register new readers.");

  // Ensure requirements and create reader
  let name = req.body.name?.toString().trim().toUpperCase();
  let description = req.body.description?.toString().trim();
  const keyBuffer = crypto.randomBytes(32);
  const secretKey = keyBuffer.toString('base64');
  const newReader = await ReaderModel.create({
    name,
    description,
    ssid: `RFID-${Math.random().toString(36).substring(2, 14).toUpperCase()}`,
    password: uuidv4(),
    secret: secretKey,
  });
  if (!newReader) return genericRes.badRequest(req, res, "Failed to create reader.");
  return genericRes.successOk(req, res, newReader, "Added reader successfully!");
}

export async function updateEntity(req: express.Request, res: express.Response) {
  if (req.body.auth.user.type != "admin") return genericRes.unauthorized(req, res, "Only admin can update reader.");

  // Ensure requirements
  let ssid = req.body.ssid?.toString().trim();
  if (!ssid) return genericRes.badRequest(req, res, "Must provide device id.");
  let isActive = req.body.isActive ?? true;

  // Update isActive status
  const updatedReader = await ReaderModel.findOneAndUpdate({ ssid }, { isActive }, { new: true });
  if (!updatedReader) return genericRes.badRequest(req, res, "Failed to update reader.");
  return genericRes.successOk(req, res, updatedReader, "Updated reader successfully!");
}