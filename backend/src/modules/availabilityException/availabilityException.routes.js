import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { validate } from "../../middleware/validate.js";
import { createAvailabilityExceptionController } from "./availabilityException.controller.js";
import { createAvailabilityExceptionSchema } from "./availabilityException.validation.js";

router.post("/", requireAuth, requireRole("doctor"), validate(createAvailabilityExceptionSchema), createAvailabilityExceptionController);

export default router;