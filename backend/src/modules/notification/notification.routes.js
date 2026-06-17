import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import { getNotificationsController, markNotificationReadController } from "./notification.controller.js";

router.get("/", requireAuth, getNotificationsController);
router.patch("/:id/read", requireAuth, markNotificationReadController);

export default router;