import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { getDoctorProfileController, updateDoctorProfileController, } from "./doctorProfile.controller.js";
import { validate } from "../../middleware/validate.js";
import { updateDoctorProfileSchema } from './doctorProfile.validation.js';

router.get( "/me", requireAuth, requireRole("doctor"), getDoctorProfileController,);
router.patch( "/me", requireAuth, requireRole("doctor"), validate(updateDoctorProfileSchema), updateDoctorProfileController,);

export default router;