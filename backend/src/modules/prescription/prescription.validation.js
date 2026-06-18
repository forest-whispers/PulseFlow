import z from "zod";

const medicationSchema = z.object({
    medicineName: z.string().trim().min(2).max(100),

    dosage: z.string().trim().min(1).max(100),

    frequency: z.string().trim().min(1).max(100),

    duration: z.string().trim().min(1).max(100),

    instructions: z.string().trim().max(500).optional(),
});

export const createPrescriptionSchema = z.object({
    medicalRecord: z.string(),
    medications: z.array(medicationSchema).min(1),
    notes: z.string().trim().max(1000).optional(),
});

export const updatePrescriptionSchema = z.object({
    medications: z.array(medicationSchema).min(1).optional(),
    notes: z.string().trim().max(1000).optional(),
});