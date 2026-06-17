import Appointment from "../modules/appointment/appointment.model.js";
import DoctorAvailability from "../modules/availability/availability.model.js";
import AvailabilityException from "../modules/availabilityException/availabilityException.model.js";
import { BadRequestError, ConflictError } from "./error.js";

export const validateAppointmentSlot = async ({ doctor, appointmentDate, bookedSlot, ignoredAppointmentId }) =>
{
    const currentDate = new Date();
    const requestedDate = new Date(appointmentDate);
    currentDate.setHours(0, 0, 0, 0);
    requestedDate.setHours(0, 0, 0, 0);
    if (requestedDate < currentDate) {
        throw new BadRequestError("Cannot book appointment for past date");
    }
    const today = currentDate.toISOString().split("T")[0];
    if (appointmentDate === today) {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const [slotHours, slotMinutes] = bookedSlot.split(":").map(Number);
        if (slotHours < currentHours || (slotHours === currentHours && slotMinutes <= currentMinutes)) {
            throw new BadRequestError("Cannot book past slot");
        }
    }
    const doctorAvailability = await DoctorAvailability.findOne({ doctor, });
    if (!doctorAvailability) {
        throw new BadRequestError("Doctor availability not configured");
    }
    const appointmentDay = new Date(appointmentDate).toLocaleDateString("en-US", { weekday: "long", }).toLowerCase();
    if (!doctorAvailability.availableDays.includes(appointmentDay)) {
        throw new BadRequestError("Doctor unavailable on selected day");
    }
    const [slotHours, slotMinutes] = bookedSlot.split(":").map(Number);
    const [startHours, startMinutes] = doctorAvailability.startTime.split(":").map(Number);
    const [endHours, endMinutes] = doctorAvailability.endTime.split(":").map(Number);
    const slotTotalMinutes = (slotHours * 60) + slotMinutes;
    const startTotalMinutes = (startHours * 60) + startMinutes;
    const endTotalMinutes = (endHours * 60) + endMinutes;
    if (slotTotalMinutes < startTotalMinutes || slotTotalMinutes >= endTotalMinutes) {
        throw new BadRequestError("Slot outside doctor availability");
    }
    const blockedDateExists = await AvailabilityException.findOne({ doctor, blockedDate: appointmentDate, });
    if (blockedDateExists) {
        throw new BadRequestError(`Doctor unavailable on selected date due to ${blockedDateExists.reason}`,);
    }
    const existingAppointment = await Appointment.findOne({ doctor, appointmentDate, bookedSlot, status: { $ne: "cancelled" }, ...(ignoredAppointmentId && { _id: { $ne: ignoredAppointmentId }, }), });
    if (existingAppointment) {
        throw new ConflictError("Slot already booked. Try a different slot.", );
    }
}