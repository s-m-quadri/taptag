import rateLimit from "express-rate-limit";
import * as genericRes from "../controllers/generic.controller";
import env from "../configurations/env.config";
import crypto from "crypto";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const OTP_TIMEOUT = 60 * 60 * 1000;

export const rate1per1min = rateLimit({ windowMs: 60 * 1000, limit: 1, handler: (req, res, next, options) => genericRes.tooManyRequest(req, res) });
export const rate6per1min = rateLimit({ windowMs: 60 * 1000, limit: 6, handler: (req, res, next, options) => genericRes.tooManyRequest(req, res) });
export const rate30per1min = rateLimit({ windowMs: 60 * 1000, limit: 30, handler: (req, res, next, options) => genericRes.tooManyRequest(req, res) });
export const rate3per5min = rateLimit({ windowMs: 5 * 60 * 1000, limit: 3, handler: (req, res, next, options) => genericRes.tooManyRequest(req, res) });

export function getOTP() {
  let otp: number = Math.floor(100000 + Math.random() * 900000);
  return otp
}

export function getPhrase(mobileNo: string, otp: number, type: string, expires: number) {
  return `${mobileNo}.${otp}.${type}.${expires}`;
}

export function getHash(phrase: string) {
  return crypto.createHmac("sha256", env.SECRET as crypto.BinaryLike).update(phrase).digest("hex");
}

export function getToken(mobileNo: string, otp: number, type: string, expires: number) {
  return `${getHash(getPhrase(mobileNo, otp, type, expires))}.${expires}`;
}

export function createToken(mobileNo: string, otp: number, type: string) {
  let expires: number = Date.now() + OTP_TIMEOUT;
  return getToken(mobileNo, otp, type, expires);
}

export function isValidToken(token: string, mobileNo: string, otp: number, type: string) {
  const [_, expires] = token.split(".");
  if (Date.now() > +expires) throw Error("Token is expired!")
  return token === getToken(mobileNo, otp, type, +expires);
}

export function getSecret(mobileNo: string) {
  return jwt.sign({ "mobileNo": mobileNo }, env.JWT_SECRET, { expiresIn: "1y" });
}

export async function getPasswordHash(password: string) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw Error("Something went wrong in hashing.");
  }
}

export async function isValidPassword(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw Error("Something went wrong in hash matching.");
  }
}