import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import upload from "../../middleware/upload.js";
import { getPatientProfileController, updatePatientProfileController, updatePatientProfilePictureController } from "./patientProfile.controller.js";
import { validate } from "../../middleware/validate.js";
import { updatePatientProfileSchema } from './patientProfile.validation.js';

router.get( "/me", requireAuth, requireRole("patient"), getPatientProfileController );
router.patch( "/me", requireAuth, requireRole("patient"), validate(updatePatientProfileSchema), updatePatientProfileController );
router.patch("/profile-picture", requireAuth, requireRole("patient"), upload.single("profilePicture"), updatePatientProfilePictureController);

export default router;