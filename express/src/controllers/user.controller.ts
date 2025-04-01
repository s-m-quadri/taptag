import express from "express";
import * as genericRes from "./generic.controller";
import * as auth from "../configurations/auth.config";
import UserModel from "../models/user.model";

const excludeSensitiveFields = "-password -__v -createdAt -updatedAt";

export async function getEntity(req: express.Request, res: express.Response) {
  try {
    // Non admin user can only query itself
    if (req.body.auth.user.type != "admin") return genericRes.successOk(req, res, req.body.auth.user, "This is the logged in user.");

    // Admin user can query by id, mobileNo, type
    let queryId = req.query.id?.toString().trim();
    let queryMobileNo = req.query.mobileNo?.toString().trim();
    let queryType = req.query.type?.toString().trim().toLowerCase();
    let queryDb = {};
    if (queryId) queryDb = { ...queryDb, _id: queryId };
    if (queryMobileNo) queryDb = { ...queryDb, mobileNo: queryMobileNo };
    if (queryType) queryDb = { ...queryDb, type: queryType };
    const allUsers = await UserModel.find(queryDb).sort("name").select(excludeSensitiveFields);
    return genericRes.successOk(req, res, allUsers, `Here are ${allUsers.length} ${queryType ? queryType : "user"}s.`);
  } catch (error) {
    return genericRes.badRequest(req, res, (error as Error).message, "Something went wrong!");
  }
}

export async function createEntity(req: express.Request, res: express.Response) {
  if (req.body.auth.user.type != "admin") return genericRes.unauthorized(req, res, "Only admin can create new users.");

  // Ensure requirements
  let mobileNo = req.body.mobileNo?.toString().trim();
  let name = req.body.name?.toString().trim();
  let email = req.body.email?.toString().trim();
  let rawPassword = req.body.password?.toString().trim();
  let type = req.body.type?.toString().trim().toLowerCase();
  let isVerified = req.body.verified ?? false;
  if (!mobileNo) return genericRes.badRequest(req, res, "Invalid mobile number.");
  if (!name) return genericRes.badRequest(req, res, "Must provide name.");
  if (!email) return genericRes.badRequest(req, res, "Invalid email.");
  if (!rawPassword) return genericRes.badRequest(req, res, "Must provide password.");
  if (!type) return genericRes.badRequest(req, res, "Invalid user type.");
  if (type == "admin") return genericRes.badRequest(req, res, "Cannot create user type as admin.");

  // Form new user data
  let password = await auth.getPasswordHash(rawPassword);
  let newUserData = { mobileNo, name, email, password, type, verified: isVerified };

  // Check for duplicate verified user
  const duplicate = await UserModel.findOne({ mobileNo, verified: true });
  if (duplicate) return genericRes.forbidden(req, res, "A verified user with same mobile number already exists.")

  // Create user or update if already exists as unverified
  const newUser = await UserModel.findOneAndUpdate({ mobileNo: mobileNo }, newUserData, { new: true, upsert: true });
  if (!newUser) throw Error("Failed to create new user!");

  let sanitizedUser = newUser.toObject();
  sanitizedUser = { ...sanitizedUser, password: "" };
  return genericRes.successOk(req, res, sanitizedUser, "Added user successfully!");
}

export async function updateEntity(req: express.Request, res: express.Response) {
  // Ensure requirements
  // TO_OPTIMIZE: Shift validations to the model
  let name = req.body.name?.toString().trim();
  let email = req.body.email?.toString().trim();
  let rawPassword = req.body.password?.toString().trim();
  let type = req.body.type?.toString().trim().toLowerCase();
  let image = req.body.image?.toString().trim();
  if (!name) return genericRes.badRequest(req, res, "Must provide name.");
  if (!email) return genericRes.badRequest(req, res, "Invalid email.");
  if (!rawPassword) return genericRes.badRequest(req, res, "Must provide password.");
  if (!type) return genericRes.badRequest(req, res, "Invalid user type.");
  if (type == "admin") return genericRes.badRequest(req, res, "Cannot update user type to admin.");

  // Form new user data
  let password = await auth.getPasswordHash(rawPassword);
  let newUserData = { name, email, password, image, type };

  // Admin can update any user by providing id
  const user = req.body.auth.user;
  if (user.type == "admin") {
    let queryId = req.query.id as string;
    if (!queryId) return genericRes.badRequest(req, res, "Must provide user id.");
    let updatedUser = await UserModel.findByIdAndUpdate(queryId, newUserData, { new: true }).select(excludeSensitiveFields);
    if (!updatedUser) return genericRes.badRequest(req, res, "Failed to update user.");
    return genericRes.successOk(req, res, updatedUser, "Updated user successfully!");
  }

  // Non admin users can only update themselves
  let updatedUser = await UserModel.findByIdAndUpdate(user._id, newUserData, { new: true }).select(excludeSensitiveFields);
  if (!updatedUser) return genericRes.badRequest(req, res, "Failed to update user.");
  return genericRes.successOk(req, res, updatedUser, "Updated user successfully!");
}

export async function deleteEntity(req: express.Request, res: express.Response) {
  // Admin can delete any user by providing id
  const user = req.body.auth.user;
  if (user.type == "admin") {
    let queryId = req.query.id as string;
    if (!queryId) return genericRes.badRequest(req, res, "Must provide user id.");
    let deletedUser = await UserModel.findByIdAndDelete(queryId).select(excludeSensitiveFields);
    if (!deletedUser) return genericRes.badRequest(req, res, "Failed to delete user.");
    return genericRes.successOk(req, res, deletedUser, "Deleted user successfully!");
  }

  // Non admin users can only delete themselves i.e. suspend instead of delete
  let suspendedUser = await UserModel.findByIdAndUpdate(user._id, { suspended: true }, { new: true }).select(excludeSensitiveFields);
  if (!suspendedUser) return genericRes.badRequest(req, res, "Failed to suspend user.");
  return genericRes.successOk(req, res, suspendedUser, "Suspended user successfully!");
}