import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { createPrescriptionController, getPrescriptionController, getMyPrescriptionsController, updatePrescriptionController, deletePrescriptionController } from "./prescription.controller.js";
import { validate } from "../../middleware/validate.js";
import { createPrescriptionSchema, updatePrescriptionSchema } from "./prescription.validation.js";

router.post("/", requireAuth, requireRole("doctor"), validate(createPrescriptionSchema), createPrescriptionController);

router.get("/", requireAuth, requireRole("patient"), getMyPrescriptionsController);

router.get("/:id", requireAuth, getPrescriptionController);

router.patch("/:id", requireAuth, requireRole("doctor"), validate(updatePrescriptionSchema), updatePrescriptionController);

router.delete("/:id", requireAuth, requireRole("doctor"), deletePrescriptionController);

export default router;