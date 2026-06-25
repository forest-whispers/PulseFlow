import { createAvailabilityExceptionService } from "./availabilityException.service.js";

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