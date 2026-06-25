import AvailabilityException from "./availabilityException.model.js";
import Appointment from "../appointment/appointment.model.js";
import { createNotificationService } from "../notification/notification.service.js";
import { ConflictError } from "../../utils/error.js";

export const createAvailabilityExceptionService = async (currUser, blockedDate, reason) => {
    const existingException = await AvailabilityException.findOne({ doctor: currUser.id, blockedDate });
    if (existingException) {
        throw new ConflictError("Blocked date already exists");
    }
    const availabilityException = await AvailabilityException.create({ doctor: currUser.id, blockedDate, reason });
    const affectedAppointments = await Appointment.find({ doctor: currUser.id, appointmentDate: blockedDate, status: { $nin: ["cancelled", "completed"], }, });
    if (affectedAppointments.length > 0)
    {
        await Appointment.updateMany( { doctor: currUser.id, appointmentDate: blockedDate, status: { $nin: ["cancelled", "completed"], }, }, { status: "pending_reschedule", }, );
        for (const appointment of affectedAppointments) {
            await createNotificationService(appointment.patient, "Appointment Needs Rescheduling", "Doctor unavailable on selected date. Please reschedule appointment.", );
        }
    }
    return availabilityException;
};