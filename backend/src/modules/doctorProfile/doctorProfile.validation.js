import { z } from "zod";

export const updateDoctorProfileSchema = z.object({
    specialization: z.string().trim().min(3).optional(),
    experience: z.number().min(0).optional(),
    consultationFee: z.number().min(0).optional(),
    clinicAddress: z.string().trim().optional(),
    bio: z.string().trim().optional(),
});