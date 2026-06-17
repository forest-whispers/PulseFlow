import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import { getDoctorDashboardController } from "./doctorDashboard.controller.js";

router.get("/doctor", requireAuth, getDoctorDashboardController);

export default router;