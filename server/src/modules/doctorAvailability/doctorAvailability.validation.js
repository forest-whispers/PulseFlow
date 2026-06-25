import { z } from "zod";

export const createAvailabilitySchema = z.object({
    availableDays: z.array(
        z.enum([ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", ]), ).min(1, "At least one day required"),
    startTime: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time"),
    endTime: z.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time"),
    slotDuration: z.number().min(5, "Invalid slot duration"),
});

export const updateAvailabilitySchema =
    createAvailabilitySchema.partial();