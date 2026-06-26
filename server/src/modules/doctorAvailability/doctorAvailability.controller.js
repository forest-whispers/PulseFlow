import { updateAvailabilityService, getAvailabilityService,} from "./doctorAvailability.service.js";

export const updateAvailabilityController = async (req,res,next,) => {
    try {
        const schedule = await updateAvailabilityService( req.user, req.body,);
        res.status(200).json({
            success: true,
            message: "schedule update successful",
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailabilityController = async (req,res,next,) => {
    try {
        const schedule = await getAvailabilityService( req.user,);
        res.status(200).json({
            success: true,
            data: schedule,
        });
    } catch (error) {
        next(error);
    }
};