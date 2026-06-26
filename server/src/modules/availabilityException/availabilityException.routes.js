import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { validate } from "../../middleware/validate.js";
import { createAvailabilityExceptionController, getAvailabilityExceptionsController, deleteAvailabilityExceptionController } from "./availabilityException.controller.js";
import { createAvailabilityExceptionSchema } from "./availabilityException.validation.js";

router.post("/", requireAuth, requireRole("doctor"), validate(createAvailabilityExceptionSchema), createAvailabilityExceptionController);

router.get("/me", requireAuth, requireRole("doctor"), getAvailabilityExceptionsController,);

router.delete("/:blockedDate", requireAuth, requireRole("doctor"), deleteAvailabilityExceptionController );

export default router;