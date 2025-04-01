import express from "express";

import { isAuthorized } from "../middleware/auth.middleware";
import * as userModel from "../controllers/user.controller";
import * as auth from "../configurations/auth.config";

const router = express.Router();

// Main routes
router.get("/", auth.rate30per1min, isAuthorized, userModel.getEntity);
router.post("/", auth.rate3per5min, isAuthorized, userModel.createEntity);
router.put("/", auth.rate3per5min, isAuthorized, userModel.updateEntity);
router.delete("/", auth.rate3per5min, isAuthorized, userModel.deleteEntity);

export default router;
