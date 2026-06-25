import { getNotificationsService, markNotificationReadService, getUnreadNotificationCountService, markAllNotificationsReadService } from "./notification.service.js";

export const getNotificationsController = async (req, res, next) => {
    try {
        const notifications = await getNotificationsService(req.user.id, req.query);
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
        const notification = await markNotificationReadService(req.user.id, req.params.id);
        res.status(200).json({
            success: true,
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const getUnreadNotificationCountController = async (req, res, next) => {
    try {
        const count = await getUnreadNotificationCountService(req.user.id);
        res.status(200).json({
            success: true,
            data: count,
        });
    } catch (error) {
        next(error);
    }
};

export const markAllNotificationsReadController = async (req, res, next) => {
    try {
        const result = await markAllNotificationsReadService(req.user.id);
        res.status(200).json({
            success: true,
            data: null,
        });
    } catch (error) {
        next(error);
    }
};