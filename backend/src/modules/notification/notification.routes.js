import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import { getNotificationsController, markNotificationReadController, getUnreadNotificationCountController, markAllNotificationsReadController } from "./notification.controller.js";

router.get("/", requireAuth, getNotificationsController);
router.get("/unread-count", requireAuth, getUnreadNotificationCountController);
router.patch("/:id/read", requireAuth, markNotificationReadController);
router.patch("/read-all", requireAuth, markAllNotificationsReadController);

export default router;