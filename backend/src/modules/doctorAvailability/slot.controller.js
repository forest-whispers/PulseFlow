import { BadRequestError } from "../../utils/error.js";
import { getAvailableSlotsService } from "./slot.service.js";

export const getAvailableSlotsController = async ( req, res, next,
) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;
        if (!date) {
            throw new BadRequestError("Date query parameter is required", );
        }
        const availableSlots = await getAvailableSlotsService( doctorId, date, );

        res.status(200).json({
            success: true,
            data: availableSlots,
        });
    } catch (error) {
        next(error);
    }
};