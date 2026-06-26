import Notification from "./notification.model.js";
import { getIO, getConnectedUserSocket } from "../../socket/socket.js";
import { NotFoundError } from "../../utils/error.js";

export const createNotificationService = async (recipient, title, message) => {
    const notification = await Notification.create({ recipient, title, message });
    let io=getIO();
    let socketId=getConnectedUserSocket(recipient);
    if (socketId) {
        io.to(socketId).emit("new_notification", notification);
    }
    return notification;
};

export const getNotificationsService = async ( recipient, queryParams ) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const query = { recipient };
    if (queryParams.isRead !== undefined) {
        query.isRead = queryParams.isRead === "true";
    }
    const [notifications, totalNotifications] = await Promise.all([
            Notification.find(query).select("title message isRead createdAt").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Notification.countDocuments(query),
        ]);
    return {
        notifications,
        pagination: {
            page,
            limit,
            total: totalNotifications,
            totalPages: Math.ceil(totalNotifications / limit),
        },
    };
};

export const markNotificationReadService = async (userId, alert) => {
    const notification = await Notification.findOneAndUpdate( { _id: alert, recipient: userId, }, { isRead: true, }, { new: true, }, ).lean();
    if (!notification) {
        throw new NotFoundError("Notification not found");
    }
    return notification;
};

export const getUnreadNotificationCountService = async ( recipient ) => {
    const count = await Notification.countDocuments({ recipient, isRead: false, });
    return { count };
};

export const markAllNotificationsReadService = async (userId) => {
    await Notification.updateMany( { recipient: userId, isRead: false, }, { isRead: true, }, );
    return { status: "complete" };
};