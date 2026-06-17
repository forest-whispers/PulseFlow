import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import { getPatientDashboardController } from "./patientDashboard.controller.js";

router.get("/patient", requireAuth, getPatientDashboardController);

export default router;