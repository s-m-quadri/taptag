import express from "express";

import { isAuthorized } from "../middleware/auth.middleware";
import * as tagController from "../controllers/tag.controller";
import * as auth from "../configurations/auth.config";

const router = express.Router();

// Main routes
router.get("/", auth.rate15per1min, isAuthorized, tagController.getEntity);
router.post("/", auth.rate15per1min, isAuthorized, tagController.createEntity);
router.put("/", auth.rate15per1min, isAuthorized, tagController.updateEntity);
router.delete("/", auth.rate15per1min, isAuthorized, tagController.deleteEntity);

export default router;
