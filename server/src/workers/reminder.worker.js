import { Worker } from "bullmq";

import Appointment from "../modules/appointment/appointment.model.js";
import reminderQueue from "../queues/reminder.queue.js";
import redisConnection from "../config/redis.js";
import { createNotificationService } from "../modules/notification/notification.service.js";
import logger from "../utils/logger.js";

const reminderWorker = new Worker( reminderQueue.name, async (job) => {
        const { appointmentId, patientId } = job.data;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        await createNotificationService(patientId, "Appointment Reminder", "You have an appointment within the next hour.", );
        appointment.reminderSent = true;
        await appointment.save();
    },
    {
        connection: redisConnection,
    },
);

reminderWorker.on("completed", (job) => {
    logger.info(`Reminder job ${job.id} completed`);
});
reminderWorker.on("failed", (job, error) => {
    logger.error(
        `Reminder job ${job?.id} failed: ${error.message}`,
    );
});