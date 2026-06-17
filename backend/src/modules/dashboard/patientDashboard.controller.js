import { getPatientDashboardService } from "./patientDashboard.service.js";

export const getPatientDashboardController = async (req, res, next) => {
    try {
        const dashboard = await getPatientDashboardService(req.user.id);
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};