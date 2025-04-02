import express from 'express';
import * as genericRes from "./generic.controller";
import TagModel from "../models/tag.model";

export async function getEntity(req: express.Request, res: express.Response) {
  try {
    const queryId = req.query.id?.toString().trim();
    const queryTag = req.query.tag?.toString().trim();
    const queryStatus = req.query.status?.toString().trim();
    const queryAssociated = req.query.associated?.toString().trim();
    let query = {};
    if (queryId) query = { ...query, _id: queryId };
    if (queryTag) query = { ...query, tag: queryTag };
    if (queryStatus) query = { ...query, status: queryStatus };
    if (queryAssociated) query = { ...query, associated: queryAssociated };

    // Get all tags
    const allTags = await TagModel.find(query).sort("tag").select("-__v");
    if (!allTags) return genericRes.badRequest(req, res, "Failed to get tags.");
    return genericRes.successOk(req, res, allTags, `Here are ${allTags.length} tags.`);
  } catch (error) {
    return genericRes.badRequest(req, res, (error as Error).message, "Something went wrong!");
  }
}

export async function createEntity(req: express.Request, res: express.Response) {
  try {
    if (req.body.auth.user.type != "admin") return genericRes.unauthorized(req, res, "Only admin can register new readers.");

    // Ensure requirements and create tag
    let tag = req.body.tag?.toString().trim();
    let associated = req.body.associated?.toString().trim();
    if (!tag) return genericRes.badRequest(req, res, "Must provide tag.");
    if (!associated) return genericRes.badRequest(req, res, "Must provide associated.");

    // Create tag
    const newTag = await TagModel.create({ tag, associated, by: req.body.auth.user._id });
    if (!newTag) return genericRes.badRequest(req, res, "Failed to create tag.");
    return genericRes.successOk(req, res, newTag, "Added tag successfully!");
  } catch (error) {
    return genericRes.badRequest(req, res, (error as Error).message, "Something went wrong!");
  }
}

export async function updateEntity(req: express.Request, res: express.Response) {
  try {
    if (req.body.auth.user.type != "admin") return genericRes.unauthorized(req, res, "Only admin can register new readers.");

    // Ensure requirements
    const tag = req.body.tag?.toString().trim();
    const associated = req.body.associated?.toString().trim();
    const validTo = req.body.validTo;
    const status = req.body.status.trim();
    const statusReason = req.body.statusReason;
    if (!tag) return genericRes.badRequest(req, res, "Must provide tag ID.");

    // Update tag
    const newTag = await TagModel.findOneAndUpdate({ tag }, { validTo, status, statusReason, associated }, { new: true });
    if (!newTag) return genericRes.badRequest(req, res, "Failed to update tag.");
    return genericRes.successOk(req, res, newTag, "Updated tag successfully!");
  } catch (error) {
    return genericRes.badRequest(req, res, (error as Error).message, "Something went wrong!");
  }
}

export async function deleteEntity(req: express.Request, res: express.Response) {
  try {
    if (req.body.auth.user.type != "admin") return genericRes.unauthorized(req, res, "Only admin can register new readers.");

    // Ensure requirements
    const tag = req.body.tag?.toString().trim();
    if (!tag) return genericRes.badRequest(req, res, "Must provide tag ID.");

    // Delete tag
    const deletedTag = await TagModel.findOneAndDelete({ tag }, { new: true });
    if (!deletedTag) return genericRes.badRequest(req, res, "Failed to delete tag.");
    return genericRes.successOk(req, res, deletedTag, "Deleted tag successfully!");
  } catch (error) {
    return genericRes.badRequest(req, res, (error as Error).message, "Something went wrong!");
  }
}