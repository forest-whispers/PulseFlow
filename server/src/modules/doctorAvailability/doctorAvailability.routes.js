import express from "express";
const router = express.Router();

import { createAvailabilityController, updateAvailabilityController, getAvailabilityController,} from "./doctorAvailability.controller.js";
import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { validate } from "../../middleware/validate.js";
import { createAvailabilitySchema, updateAvailabilitySchema } from './doctorAvailability.validation.js';

router.post( "/", requireAuth, requireRole("doctor"), validate(createAvailabilitySchema), createAvailabilityController,);
router.patch( "/", requireAuth, requireRole("doctor"), validate(updateAvailabilitySchema), updateAvailabilityController,);
router.get( "/", requireAuth, requireRole("doctor"), getAvailabilityController,);

export default router;