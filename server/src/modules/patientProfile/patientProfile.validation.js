import { z } from "zod";

export const updatePatientProfileSchema = z.object({
    bloodGroup: z.string().trim().optional(),
    allergies: z.array(z.string().trim(),).optional(),
    medicalHistory: z.string().trim().optional(),
    emergencyContact: z.string().trim().optional(),
});