import { z } from "zod";

export const createAppointmentSchema = z.object({
    doctor: z.string(),
    appointmentDate: z.string(),
    bookedSlot: z.string().trim().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid slot format"),
    reason: z.string().trim().min(5, "Reason too short"),
    notes: z.string().trim().optional(),
});

export const rescheduleAppointmentSchema = z.object({
    appointmentDate: z.string(),
    bookedSlot: z.string().trim().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid slot format"),
});

export const updateAppointmentStatusSchema = z.object({
    status: z.enum(["pending", "confirmed", "completed", "pending_reschedule", "cancelled", ]),
});