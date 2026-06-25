import { getAdminDashboardService } from "./adminDashboard.service.js";

export const getAdminDashboardController = async (req, res, next) => {
    try {
        const dashboard = await getAdminDashboardService();
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};