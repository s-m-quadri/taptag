import express from "express";

import { isAuthorized } from "../middleware/auth.middleware";
import * as attendanceController from "../controllers/attendance.controller";
import * as auth from "../configurations/auth.config";

const router = express.Router();

// Main routes
router.get("/", auth.rate15per1min, isAuthorized, attendanceController.getEntity);
router.post("/", auth.rate15per1min, isAuthorized, attendanceController.createEntity);
router.put("/", auth.rate15per1min, isAuthorized, attendanceController.updateEntity);
router.delete("/", auth.rate15per1min, isAuthorized, attendanceController.deleteEntity);

export default router;
