import express from "express";

import { isAuthorized } from "../middleware/auth.middleware";
import * as userController from "../controllers/user.controller";
import * as auth from "../configurations/auth.config";

const router = express.Router();

// Main routes
router.get("/", auth.rate15per1min, isAuthorized, userController.getEntity);
router.post("/", auth.rate15per1min, isAuthorized, userController.createEntity);
router.put("/", auth.rate15per1min, isAuthorized, userController.updateEntity);
router.delete("/", auth.rate15per1min, isAuthorized, userController.deleteEntity);

export default router;
