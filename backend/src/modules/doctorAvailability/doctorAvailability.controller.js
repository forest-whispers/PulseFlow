import { createAvailabilityService, updateAvailabilityService, getAvailabilityService,} from "./doctorAvailability.service.js";

export const createAvailabilityController = async ( req, res, next,) =>
{
    try {
        const { availableDays, startTime, endTime, slotDuration,} = req.body;
        const schedule = await createAvailabilityService( req.user.id, availableDays, startTime, endTime, slotDuration,);
        res.status(201).json({
            success: true,
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};

export const updateAvailabilityController = async (req,res,next,) => {
    try {
        const schedule = await updateAvailabilityService( req.user.id, req.body,);
        res.status(200).json({
            success: true,
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailabilityController = async (req,res,next,) => {
    try {
        const schedule = await getAvailabilityService( req.user.id,);
        res.status(200).json({
            success: true,
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};