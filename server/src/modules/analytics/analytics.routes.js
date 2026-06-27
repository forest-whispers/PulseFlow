import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";

import { getAnalyticsController } from "./analytics.controller.js"

router.get( "/", requireAuth, requireRole("admin"), getAnalyticsController );

export default router;