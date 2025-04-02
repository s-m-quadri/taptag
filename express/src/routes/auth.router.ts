import express from "express";

import * as authController from "../controllers/auth.controller";
import * as auth from "../configurations/auth.config";

const router = express.Router();

// Authorization routes, with rate limiter.
router.post("/", auth.rate6per2min, authController.authenticateUser);
router.post("/login", auth.rate6per2min, authController.loginUser);
router.post("/register", auth.rate6per2min, authController.registerUser);

export default router;
