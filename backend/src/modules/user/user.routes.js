import express from "express";
const router = express.Router();

import { registerUserController, loginUserController, getUserController,} from "./user.controller.js";
import requireAuth from '../../middleware/requireAuth.js';
import { validate } from "../../middleware/validate.js";
import { registerSchema, loginSchema, } from './auth.validation.js';
import { authRateLimiter } from "../../middleware/rateLimiter.js";

router.post("/register", authRateLimiter, validate(registerSchema), registerUserController);
router.post("/login", authRateLimiter, validate(loginSchema), loginUserController);
router.get("/:id", requireAuth, getUserController);

export default router;