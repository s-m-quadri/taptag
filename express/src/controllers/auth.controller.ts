import express from "express";

import * as genericRes from "./generic.controller";
import * as auth from "../configurations/auth.config";
import UserModel from "../models/user.model";

export async function loginUser(req: express.Request, res: express.Response) {
  try {
    // Check for mobile number and/or email
    const mobileNo = req.body.mobileNo?.toString().trim();
    const email = req.body.email?.toString().trim();
    const rawPassword = req.body.password?.toString().trim();
    if (!mobileNo && !email) return genericRes.badRequest(req, res, "Must provide mobile number or email.");
    if (!rawPassword) return genericRes.badRequest(req, res, "Must provide password.");

    // Get the user
    let query = {};
    if (mobileNo) query = { ...query, mobileNo };
    if (email) query = { ...query, email };
    const user = await UserModel.findOne(query);
    if (!user) throw Error("User not found!");
    if (user.suspended === true) throw Error("User is suspended! Contact support for more information. dev.smq@gmail.com");

    // Password-based auth
    if (user.verified === false) throw Error("User not verified! Complete the registration process first.");
    const isValid: boolean = await auth.isValidPassword(rawPassword, user.password);
    console.log(isValid, user.password, rawPassword);
    if (!isValid) throw Error("Invalid Credentials");
    const secret = auth.getSecret(user.mobileNo);
    return genericRes.successOk(req, res, { secret }, "Login successful!");
  } catch (error) {
    return genericRes.unauthorized(req, res, (error as Error).message);
  }
}

export async function registerUser(req: express.Request, res: express.Response) {
  try {
    // Ensure requirements
    const mobileNo = req.body.mobileNo?.toString().trim();
    const email = req.body.email?.toString().trim().toLowerCase();
    const name = req.body.name?.toString().trim().toUpperCase();
    const rawPassword = req.body.password?.toString().trim();
    const type = req.body.type?.toString().trim().toLowerCase() ?? "customer";
    if (!rawPassword) return genericRes.badRequest(req, res, "Must provide password.");
    const password = await auth.getPasswordHash(rawPassword);
    const userDetails = { type, mobileNo, email, name, password };

    // Check for duplicate verified user
    const duplicate = await UserModel.findOne({ mobileNo: userDetails.mobileNo, verified: true });
    if (duplicate) return genericRes.forbidden(req, res, "A verified user with same mobile number already exists.")

    // Create user or update if already exists as unverified
    const newUser = await UserModel.findOneAndUpdate({ mobileNo: userDetails.mobileNo }, userDetails, { new: true, upsert: true });
    if (!newUser) throw Error("Failed to create new user!");

    const sanitizedUser = { ...newUser.toObject(), password: "" };
    return genericRes.successOk(req, res, sanitizedUser, "Successfully registered user, verification pending!");
  } catch (error) {
    return genericRes.unauthorized(req, res, (error as Error).message);
  }
}

export async function authenticateUser(req: express.Request, res: express.Response) {
  try {
    // Check for mobile number and/or email
    const mobileNo = req.body.mobileNo?.toString().trim();
    const email = req.body.email?.toString().trim();
    if (!mobileNo && !email) return genericRes.badRequest(req, res, "Must provide mobile number or email.");

    let query = {};
    if (mobileNo) query = { ...query, mobileNo };
    if (email) query = { ...query, email };

    // Get the user
    const user = await UserModel.findOne(query);
    if (!user) throw Error("User not found!");
    if (user.suspended === true) throw Error("User is suspended! Contact support for more information. dev.smq@gmail.com");

    // Authenticate user by
    // 1. Validating tokenSMS -> otpSMS, and tokenMail -> otpMail
    //    For successful authentication, at least one of the two must be verified/reverified.
    // 2. Wile authentication, if got verified recently, add 100 credits to the user.
    // 3. Update user with verification status, credit, and last login time
    let isAuthenticated = false;
    const userStatus = { mobileNo: user.verifiedMobileNo ?? false, email: user.verifiedEmail ?? false };
    const tokenSMS = req.body.tokenSMS?.toString().trim();
    const otpSMS = req.body.otpSMS?.toString().trim();
    const tokenMail = req.body.tokenMail?.toString().trim();
    const otpMail = req.body.otpMail?.toString().trim();
    if (tokenSMS) {
      if (!auth.isValidToken(tokenSMS, user.mobileNo, +otpSMS, user.type)) throw Error("Unmatched OTP for Mobile Number.");
      userStatus.mobileNo = true;
      isAuthenticated = true;
    }
    if (tokenMail) {
      if (!auth.isValidToken(tokenMail, user.mobileNo, +otpMail, user.type)) throw Error("Unmatched OTP for Email Address.");
      userStatus.email = true;
      isAuthenticated = true;
    }
    if (!isAuthenticated) throw Error("Couldn't able to authenticate user!");

    // Update user with verification status, credit, and last login time
    let authenticatedUser = await UserModel.findByIdAndUpdate(user._id, {
      verifiedEmail: userStatus.email,
      verifiedMobileNo: userStatus.mobileNo,
      verified: userStatus.email || userStatus.mobileNo,
      lastLogin: Date.now(),
    }, { new: true });
    if (!authenticatedUser) throw Error("Failed to authenticate user!");
    const secret = auth.getSecret(user.mobileNo);
    return genericRes.successOk(req, res, { secret }, "Authentication successful!");
  } catch (error) {
    return genericRes.unauthorized(req, res, (error as Error).message);
  }
}