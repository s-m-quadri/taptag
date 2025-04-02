import express from "express";

import { isAuthorized } from "../middleware/auth.middleware";
import * as readerController from "../controllers/reader.controller";
import * as auth from "../configurations/auth.config";

const router = express.Router();

// Main routes
router.get("/", auth.rate15per1min, isAuthorized, readerController.getEntity);
router.post("/", auth.rate15per1min, isAuthorized, readerController.createEntity);
router.put("/", auth.rate15per1min, isAuthorized, readerController.updateEntity);

export default router;
