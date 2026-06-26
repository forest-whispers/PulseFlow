import express from "express";
const router = express.Router();

import { updateAvailabilityController, getAvailabilityController,} from "./doctorAvailability.controller.js";
import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { validate } from "../../middleware/validate.js";
import { updateAvailabilitySchema } from './doctorAvailability.validation.js';

router.patch( "/", requireAuth, requireRole("doctor"), validate(updateAvailabilitySchema), updateAvailabilityController,);
router.get( "/me", requireAuth, requireRole("doctor"), getAvailabilityController,);

export default router;