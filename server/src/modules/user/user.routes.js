import express from "express";
const router = express.Router();

import { registerUserController, loginUserController, getUserController, getAdminProfileController, getUsersController, logoutUserController, } from "./user.controller.js";
import requireAuth from '../../middleware/requireAuth.js';
import requireRole from '../../middleware/requireRole.js';
import { validate } from "../../middleware/validate.js";
import { registerSchema, loginSchema, } from './user.validation.js';
import { authRateLimiter } from "../../middleware/rateLimiter.js";

router.post("/register", authRateLimiter, validate(registerSchema), registerUserController);
router.post("/login", authRateLimiter, validate(loginSchema), loginUserController);
router.get("/logout", requireAuth, logoutUserController);
router.get("/", requireAuth, requireRole("admin"), getUsersController,);
router.get("/me", requireAuth, requireRole("admin"), getAdminProfileController);
router.get("/:id", requireAuth, requireRole("admin"), getUserController);

export default router;