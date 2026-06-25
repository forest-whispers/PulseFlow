import express from "express";
const router = express.Router();

import { createAppointmentController, getAppointmentsController, getAppointmentController, updateAppointmentStatusController, cancelAppointmentController, rescheduleAppointmentController } from "./appointment.controller.js";
import requireAuth from '../../middleware/requireAuth.js'
import requireRole from "../../middleware/requireRole.js";
import { validate } from "../../middleware/validate.js";
import { createAppointmentSchema, updateAppointmentStatusSchema, rescheduleAppointmentSchema } from "./appointment.validation.js";

router.post("/", requireAuth, requireRole("patient"), validate(createAppointmentSchema), createAppointmentController);
router.get("/", requireAuth, getAppointmentsController);
router.patch("/:id/status", requireAuth, requireRole("doctor", "admin"), validate(updateAppointmentStatusSchema), updateAppointmentStatusController);
router.patch("/:id/cancel", requireAuth, cancelAppointmentController);
router.patch("/:id/reschedule", requireAuth, validate(rescheduleAppointmentSchema), rescheduleAppointmentController);
router.get("/:id", requireAuth, getAppointmentController);

export default router;