import cron from "node-cron";

import Appointment from "../modules/appointment/appointment.model.js";
import { addReminderJob } from "../jobs";
import { createNotificationService } from "../modules/notification/notification.service.js";
import logger from "../utils/logger.js";

export const startAppointmentReminderCron = () => {
    cron.schedule(
        "* * * * *",
        async () => {
            try {
                const now = new Date();
                const today = now.toISOString().split("T")[0];
                const nextHour = new Date(now.getTime() + (60 * 60 * 1000),);
                const upcomingAppointments = await Appointment.find({ appointmentDate: today, status: "confirmed", reminderSent: false, });
                const filteredAppointments = upcomingAppointments.filter((appointment) => {
                    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.bookedSlot}`,);
                    return (appointmentDateTime >= now && appointmentDateTime <= nextHour);
                },);
                for (const appointment of filteredAppointments) {
                    await addReminderJob(appointment._id,appointment.patient,);
                }
                logger.info(`Processed ${filteredAppointments.length} appointment reminders`,);
            } catch (error) {
                logger.error(`Appointment reminder cron failed: ${error.message}`,);
            }
        },
        {
            noOverlap: true,
        },
    );
};