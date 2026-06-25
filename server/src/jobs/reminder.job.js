import reminderQueue from "../queues/reminder.queue.js";

export const addReminderJob = async (appointmentId, patientId) => {
    await reminderQueue.add(
        "send-reminder",
        {
            appointmentId,
            patientId,
        },
        {
            jobId: `appointment-reminder-${appointmentId}`,
        },
    );
};