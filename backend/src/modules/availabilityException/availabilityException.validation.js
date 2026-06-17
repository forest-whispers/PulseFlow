import { z } from "zod";

export const createAvailabilityExceptionSchema = z.object({
    blockedDate: z.string(),
    reason: z.string().trim().optional(),
});