import { searchDoctorsService } from "./doctorSearch.service.js";

export const searchDoctorsController = async (req, res, next) => {
    try {
        const doctors = await searchDoctorsService(req.query);
        res.status(200).json({
            success: true,
            data: doctors,
        });
    } catch (error) {
        next(error);
    }
};