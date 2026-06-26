import AvailabilityException from "./availabilityException.model.js";
import Appointment from "../appointment/appointment.model.js";
import { createNotificationService } from "../notification/notification.service.js";
import { ConflictError, NotFoundError, ForbiddenError } from "../../utils/error.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";

export const createAvailabilityExceptionService = async (currUser, blockedDate, reason) => {
    const existingException = await AvailabilityException.findOne({ doctor: currUser.id, "blockedDates.blockedDate": blockedDate });
    if (existingException) {
        throw new ConflictError("Already blocked the date for accepting appointments");
    }
    const doctorExceptions = await AvailabilityException.findOne({ doctor: currUser.id });
    let availabilityException;
    if (doctorExceptions) {
        availabilityException = await AvailabilityException.findOneAndUpdate(
            { doctor: currUser.id },
            { $push: { blockedDates: { blockedDate, reason } } },
            { new: true }
        );
    } else {
        availabilityException = await AvailabilityException.create({
            doctor: currUser.id,
            blockedDates: [ { blockedDate, reason } ],
        });
    }
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

export const getAvailabilityExceptionsService = async (currUser) => {
    const exceptionsList = await AvailabilityException.find({ doctor: currUser.id });
    
    if (exceptionsList.length === 0) {
        throw new NotFoundError("No blocked dates");
    }
    if (exceptionsList.length > 1) {
        const allBlockedDates = [];
        const seenDates = new Set();
        for (const doc of exceptionsList) {
            for (const item of doc.blockedDates) {
                if (!seenDates.has(item.blockedDate)) {
                    seenDates.add(item.blockedDate);
                    allBlockedDates.push({
                        blockedDate: item.blockedDate,
                        reason: item.reason,
                    });
                }
            }
        }
        await AvailabilityException.updateOne(
            { _id: exceptionsList[0]._id },
            { $set: { blockedDates: allBlockedDates } }
        );
        const idsToDelete = exceptionsList.slice(1).map(doc => doc._id);
        await AvailabilityException.deleteMany({ _id: { $in: idsToDelete } });
        
        const updatedDoc = await AvailabilityException.findById(exceptionsList[0]._id).lean();
        return updatedDoc;
    }
    const exceptions = exceptionsList[0].toObject();
    if (exceptions.blockedDates.length === 0) {
        throw new NotFoundError("No blocked dates");
    }
    return exceptions;
};

export const deleteAvailabilityExceptionService = async (currUser, exceptionDate) => {
    const availabilityException = await AvailabilityException.findOne({
        doctor: currUser.id,
        "blockedDates.blockedDate": exceptionDate,
      });
    if (!availabilityException) {
        throw new NotFoundError("Something went wrong",);
    }
    if (availabilityException.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot modify the blocked date setting",);
    }
    await AvailabilityException.updateOne(
        { doctor: currUser.id },
        {
            $pull: {
                blockedDates: {
                    blockedDate: exceptionDate,
                },
            },
        }
      );
    await createAuditLogService(currUser.id, "availability_exception_deleted", "availability_exception", availabilityException._id, {},);
};