import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import upload from "../../middleware/upload.js";
import { createMedicalRecordController, getMedicalRecordController, getMyMedicalRecordsController, updateMedicalRecordController, deleteMedicalRecordController } from "./medicalRecord.controller.js";
import { validate } from "../../middleware/validate.js";
import { createMedicalRecordSchema, updateMedicalRecordSchema } from "./medicalRecord.validation.js";


router.post( "/", requireAuth, requireRole("doctor"), upload.array("attachments", 5), validate(createMedicalRecordSchema), createMedicalRecordController );

router.get( "/", requireAuth, requireRole("patient"), getMyMedicalRecordsController );

router.get( "/:id", requireAuth, getMedicalRecordController );

router.patch("/:id", requireAuth, requireRole("doctor"), upload.array("attachments", 5), validate(updateMedicalRecordSchema), updateMedicalRecordController );

router.delete( "/:id", requireAuth, requireRole("doctor"), deleteMedicalRecordController );

export default router;