import express from "express";

import * as authController from "../controllers/auth.controller";
import * as auth from "../configurations/auth.config";

const router = express.Router();

// Authorization routes, with rate limiter.
router.post("/", auth.rate6per1min, authController.authenticateUser);
router.post("/login", auth.rate6per1min, authController.loginUser);
router.post("/register", auth.rate6per1min, authController.registerUser);

export default router;
