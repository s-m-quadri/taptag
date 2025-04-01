import jwt, { JwtPayload } from 'jsonwebtoken';
import express from "express";
import * as genericRes from "../controllers/generic.controller";
import env, { DEBUG } from '../configurations/env.config';
import UserModel from '../models/user.model';

export async function isAuthorized(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    // Ensure requirements
    let token: string = "";
    if (req.headers.token) token = req.headers.token as string;
    if (req.headers.authorization) token = req.headers.authorization as string;
    if (!token) return genericRes.unauthorized(req, res, "No token provided");

    // Decode and validate token
    let decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    let mobileNo: string = decoded.mobileNo;

    // Get the user
    const userModel = UserModel;
    let user = await userModel.findOne({ mobileNo });
    if (DEBUG) console.log("[auth.middleware] Spotted user:", user?.type, user);
    if (!user) return genericRes.unauthorized(req, res, "No user exists");

    // Check for verifications and activation
    if (!user.verified) return genericRes.unauthorized(req, res, "User is not verified, please verify or re-register your account!");
    if (user.suspended) return genericRes.unauthorized(req, res, "User is suspended!");
    // TODO: check if user.activated

    // Exclude sensitive information and pass the user to the next middleware as auth
    let sanitizedUser = user.toObject();
    sanitizedUser = { ...sanitizedUser, password: "" };
    req.body = { ...req.body, auth: { user: sanitizedUser } };
    return next();
  } catch (err) {
    if ((err as Error).name === "JsonWebTokenError") return genericRes.unauthorized(req, res, "Invalid token spotted in the middleware.");
    return genericRes.unauthorized(req, res, "Authorization failed in the middleware.");
  }
};