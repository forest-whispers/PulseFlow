import { getDoctorDashboardService } from "./doctorDashboard.service.js";

export const getDoctorDashboardController = async (req, res, next) => {
    try {
        const dashboard = await getDoctorDashboardService(req.user.id);
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};