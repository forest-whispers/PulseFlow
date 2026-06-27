import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import upload from "../../middleware/upload.js";
import { createLabResultController, getLabResultController, getMyLabResultsController, updateLabResultController, deleteLabResultController } from "./labResult.controller.js";
import { validate } from "../../middleware/validate.js";
import { createLabResultSchema, updateLabResultSchema } from "./labResult.validation.js";

router.post("/", requireAuth, requireRole("doctor"), upload.single("report"), validate(createLabResultSchema), createLabResultController);

router.get("/", requireAuth, requireRole("patient"), getMyLabResultsController);

router.get("/:id", requireAuth, getLabResultController);

router.patch("/:id", requireAuth, requireRole("doctor"), upload.single("report"), validate(updateLabResultSchema), updateLabResultController);

router.delete("/:id", requireAuth, requireRole("doctor"), deleteLabResultController);

export default router;