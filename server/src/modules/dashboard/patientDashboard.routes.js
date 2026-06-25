import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import { getPatientDashboardController } from "./patientDashboard.controller.js";

router.get("/", requireAuth, getPatientDashboardController);

export default router;