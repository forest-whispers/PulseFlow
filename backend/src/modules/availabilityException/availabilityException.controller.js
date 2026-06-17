import { createAvailabilityExceptionService } from "./availabilityException.service.js";

export const createAvailabilityExceptionController = async (req, res, next) => {
    try {
        const { blockedDate, reason }=req.body;
        const availabilityException = await createAvailabilityExceptionService( req.user.id, blockedDate, reason, );
        res.status(201).json({
            success: true,
            data: availabilityException,
        });
    } catch (error) {
        next(error);
    }
};