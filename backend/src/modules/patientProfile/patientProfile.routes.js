import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { getPatientProfileController, updatePatientProfileController } from "./patientProfile.controller.js";
import { validate } from "../../middleware/validate.js";
import { updatePatientProfileSchema } from './patientProfile.validation.js';

router.get( "/me", requireAuth, requireRole("patient"), getPatientProfileController );
router.patch( "/me", requireAuth, requireRole("patient"), validate(updatePatientProfileSchema), updatePatientProfileController );

export default router;