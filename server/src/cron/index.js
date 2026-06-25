import { startAppointmentReminderCron } from "./appointmentReminder.cron.js";

export const initializeCronJobs = () => {
    startAppointmentReminderCron();
};