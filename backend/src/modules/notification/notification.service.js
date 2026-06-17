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

export const getNotificationsService = async (recipient) => {
    const notifications = await Notification.find({ recipient }).sort({ createdAt: -1 });
    return notifications;
};

export const markNotificationReadService = async (notification) => {
    const notification = await Notification.findById(notification);
    if (!notification) {
        throw new NotFoundError("Notification not found");
    }
    notification.isRead = true;
    await notification.save();
    return notification;
};