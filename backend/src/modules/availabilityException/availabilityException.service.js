import AvailabilityException from "./availabilityException.model.js";
import Appointment from "../appointment/appointment.model.js";
import { createNotificationService } from "../notification/notification.service.js";
import { ConflictError } from "../../utils/error.js";

export const createAvailabilityExceptionService = async (doctor, blockedDate, reason) => {
    const existingException = await AvailabilityException.findOne({ doctor, blockedDate });
    if (existingException) {
        throw new ConflictError("Blocked date already exists");
    }
    const availabilityException = await AvailabilityException.create({ doctor, blockedDate, reason });
    const affectedAppointments = await Appointment.find({ doctor, appointmentDate: blockedDate, status: { $nin: ["cancelled", "completed"], }, });
    if (affectedAppointments.length > 0)
    {
        await Appointment.updateMany( { doctor, appointmentDate: blockedDate, status: { $nin: ["cancelled", "completed"], }, }, { status: "pending_reschedule", }, );
        for (const appointment of affectedAppointments) {
            await createNotificationService(appointment.patient, "Appointment Needs Rescheduling", "Doctor unavailable on selected date. Please reschedule appointment.", );
        }
    }
    return availabilityException;
};