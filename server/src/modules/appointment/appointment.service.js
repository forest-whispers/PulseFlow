import Appointment from "./appointment.model.js";
import DoctorAvailability from "../doctorAvailability/doctorAvailability.model.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { validateAppointmentSlot } from '../../utils/validateAppointmentSlot.js'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError, ForbiddenError } from '../../utils/error.js'

export const createAppointmentService = async (currUser, {doctor, appointmentDate, bookedSlot, reason, notes,}) =>
{
    if(currUser.role==="doctor")
    {
        throw new UnauthorizedError("Doctors are not allowed to book appointments from doctor portal");
    }
    const patient = currUser.id;
    await validateAppointmentSlot({ doctorId: doctor, appointmentDate, bookedSlot, });
    const appointment = await Appointment.create({ patient, doctor, appointmentDate, bookedSlot, reason, notes,});
    await createAuditLogService( patient, "appointment_booked", "appointment", appointment._id, { doctor, appointmentDate, bookedSlot, }, );
    return appointment;
};

export const getAppointmentsService = async (currUser, queryParams) =>
{
    const query = {};
    let role=currUser.role;
    if(role==="patient")
    {
        query.patient = currUser.id
    }
    else if(role==="doctor")
    {
        query.doctor = currUser.id
    }
    if (queryParams.status) {
        query.status = queryParams.status;
    }
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const [appointments, totalAppointments] = await Promise.all([
        Appointment.find(query)
            .select("patient doctor appointmentDate bookedSlot status reason").populate("patient", "name").populate("doctor", "name").sort({ appointmentDate: -1, bookedSlot: -1, }).skip(skip).limit(limit).lean(),
        Appointment.countDocuments(query),
    ]);
    return {
        appointments,
        pagination: {
            page,
            limit,
            total: totalAppointments,
            totalPages: Math.ceil(totalAppointments / limit),
        },
    };
};

export const getAppointmentService = async (currUser, appointmentId) => {
    const appointment = await Appointment.findById(appointmentId).populate("patient", "name").populate("doctor", "name").lean();
    if (!appointment) {
        throw new NotFoundError("Appointment not found");
    }
    if (currUser.role === "patient" && currUser.id.toString() !== appointment.patient._id.toString()) {
        throw new ForbiddenError("You cannot access this appointment details");
    }
    if (currUser.role === "doctor" && currUser.id.toString() !== appointment.doctor._id.toString()) {
        throw new ForbiddenError("You cannot access this appointment details");
    }
    const medicalRecord = await MedicalRecord.findOne({ appointment: appointmentId, }).select("_id visitDate").lean();
    let prescription = null;
    let labResult = null;
    let invoice = null;
    if (medicalRecord) {
        [prescription, labResult, invoice] = await Promise.all([
            Prescription.findOne({ medicalRecord: medicalRecord._id }).select("_id").lean(),
            LabResult.findOne({ medicalRecord: medicalRecord._id }).select("_id testName resultSummary").lean(),
            Invoice.findOne({ medicalRecord: medicalRecord._id }).select("_id amount status").lean(),
        ]);
    }
    return {
        appointment,
        related: {
            medicalRecord,
            prescription,
            labResult,
            invoice,
        },
    };
};

export const updateAppointmentStatusService=async (currUser, appointmentId, newstatus)=>
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
    await createAuditLogService(currUser.id, "appointment_status_updated", "appointment", appointment._id, { patient: appointment.patient, appointmentDate: appointment.appointmentDate, bookedSlot: appointment.bookedSlot, },);
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
    if(appointment.status==="cancelled")
    {
        throw new BadRequestError("Appointment already cancelled", );
    }
    appointment.status = "cancelled";
    await appointment.save();
    await createAuditLogService(currUser.id, "appointment_cancelled", "appointment", appointment._id, { appointmentDate: appointment.appointmentDate, bookedSlot: appointment.bookedSlot, },);
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
    await validateAppointmentSlot({ doctorId: appointment.doctor, appointmentDate, bookedSlot, ignoredAppointmentId: appointment._id, allowInactiveDoctor: true, });
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