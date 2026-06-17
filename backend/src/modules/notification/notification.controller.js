import { getNotificationsService, markNotificationReadService } from "./notification.service.js";

export const getNotificationsController = async (req, res, next) => {
    try {
        const notifications = await getNotificationsService(req.user.id);
        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

export const markNotificationReadController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await markNotificationReadService(id);
        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};