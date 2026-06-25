import { searchDoctorsService, getDoctorDetailsService, getAvailableSlotsService, } from "./doctorSearch.service.js";

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

export const getDoctorDetailsController = async (req, res, next) => {
    try {
        const doctor = await getDoctorDetailsService(req.params.id);
        res.status(200).json({
            success: true,
            data: doctor,
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableSlotsController = async (req, res, next) => {
    try {
        const slots = await getAvailableSlotsService( req.params.id, req.query.date,);
        res.status(200).json({
            success: true,
            data: slots,
        });
    } catch (error) {
        next(error);
    }
};