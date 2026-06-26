import { createAvailabilityExceptionService, getAvailabilityExceptionsService, deleteAvailabilityExceptionService } from "./availabilityException.service.js";

export const createAvailabilityExceptionController = async (req, res, next) => {
    try {
        const { blockedDate, reason }=req.body;
        const availabilityException = await createAvailabilityExceptionService( req.user, blockedDate, reason, );
        res.status(201).json({
            success: true,
            message: "new bookings for the day will be blocked, and existing ones need rescheduling",
            data: availabilityException,
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailabilityExceptionsController = async (req, res, next,) => {
    try {
        const exceptions = await getAvailabilityExceptionsService(req.user,);
        res.status(200).json({
            success: true,
            data: exceptions,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAvailabilityExceptionController = async (req, res, next) => {
    try {
        await deleteAvailabilityExceptionService(req.user, req.params.blockedDate,);
        res.status(204).send({
            success: true,
            message: "availability exception deleted",
            data: null
        });
    } catch(error) {
        next(error);
    }
};