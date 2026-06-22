import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { getAdminDashboardController } from "./adminDashboard.controller.js";

router.get("/", requireAuth, requireRole("admin"), getAdminDashboardController);

export default router;