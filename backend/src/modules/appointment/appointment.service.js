import Appointment from "./appointment.model.js";
import DoctorAvailability from "../doctorAvailability/doctorAvailability.model.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { validateAppointmentSlot } from '../../utils/validateAppointmentSlot.js'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../../utils/error.js'

export const createAppointmentService = async (currUser, {doctor, appointmentDate, bookedSlot, reason, notes,}) =>
{
    if(currUser.role==="doctor")
    {
        throw new UnauthorizedError("Doctors are not allowed to book appointments from doctor portal");
    }
    const patient = currUser.id;
    await validateAppointmentSlot({ doctor, appointmentDate, bookedSlot, });
    const appointment = await Appointment.create({ patient, doctor, appointmentDate, bookedSlot, reason, notes,});
    await createAuditLogService( patient, "appointment_booked", "appointment", appointment._id, { doctor, appointmentDate, bookedSlot, }, );
    return appointment;
};

export const getAppointmentsService = async (currUser) =>
{
    let query = {};
    let role=currUser.role;
    if(role==="patient")
    {
        query={patient:currUser.id}
    }
    else if(role==="doctor")
    {
        query={doctor:currUser.id}
    }
    const appointments = await Appointment.find(query).populate("patient", "name email").populate("doctor", "name email");
    return appointments;
};

export const updateAppointmentStatusService=async (doctor, appointmentId, newstatus)=>
{
    const appointment=await Appointment.findById(appointmentId);
    if(!appointment)
    {
        throw new NotFoundError("Appointment not found");
    }
    const allowedTransitions = {
        pending: ["confirmed", "pending_reschedule", "cancelled"],
        confirmed: ["completed", "pending_reschedule", "cancelled"],
        pending_reschedule: ["confirmed", "cancelled"],
        completed: [],
        cancelled: [],
    };
    const validTransitionStatueses = allowedTransitions[appointment.status] || [];
    if(!validTransitionStatueses.includes(newstatus))
    {
        throw new BadRequestError("This status transition cannot be entertained")
    }
    const updatedAppointment=await Appointment.findByIdAndUpdate(appointmentId, {status: newstatus}, {new: true, runValidators: true});
    await createAuditLogService(doctor, "appointment_status_updated", "appointment", appointment._id, { patient: appointment.patient, appointmentDate: appointment.appointmentDate, bookedSlot: appointment.bookedSlot, },);
    return updatedAppointment;
};

export const cancelAppointmentService = async ( currUser, appointmentId ) =>
{
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new NotFoundError( "Appointment not found", );
    }
    if(currUser.role==="patient" && currUser.id.toString()!==appointment.patient.toString())
    {
        throw new UnauthorizedError("Cancellation unauthorized");
    }
    if(currUser.role==="doctor" && currUser.id.toString()!==appointment.doctor.toString())
    {
        throw new UnauthorizedError("Cancellation unauthorized");
    }
    appointment.status = "cancelled";
    await appointment.save();
    await createAuditLogService(currUser, "appointment_cancelled", "appointment", appointment._id, { appointmentDate: appointment.appointmentDate, bookedSlot: appointment.bookedSlot, },);
    return appointment;
};

export const rescheduleAppointmentService = async ( currUser, appointmentId, appointmentDate, bookedSlot ) =>
{
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new NotFoundError("Appointment not found", );
    }
    if (currUser.role === "patient" && currUser.id.toString() !== appointment.patient.toString()) {
        throw new UnauthorizedError("Cancellation unauthorized");
    }
    if (currUser.role === "doctor" && currUser.id.toString() !== appointment.doctor.toString()) {
        throw new UnauthorizedError("Cancellation unauthorized");
    }
    await validateAppointmentSlot({ doctor: appointment.doctor, appointmentDate, bookedSlot, });
    await createAuditLogService(currUser.id, "appointment_rescheduled", "appointment", appointment._id, { previousAppointmentDate: appointment.appointmentDate, previousBookedSlot: appointment.bookedSlot, newAppointmentDate: appointmentDate, newBookedSlot: bookedSlot, },);
    appointment.appointmentDate = appointmentDate;
    appointment.bookedSlot = bookedSlot;
    if (appointment.status === "pending_reschedule") {
        appointment.status = "confirmed";
    }
    appointment.reminderSent = false;
    await appointment.save();
    return appointment;
};