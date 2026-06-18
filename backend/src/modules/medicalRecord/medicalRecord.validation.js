import z from "zod";

export const createMedicalRecordSchema = z.object({
    patient: z.string(),

    visitDate: z.iso.date(),

    chiefComplaint: z
        .string()
        .trim()
        .min(5)
        .max(500),

    diagnosis: z
        .string()
        .trim()
        .max(1000)
        .optional(),

    treatment: z
        .string()
        .trim()
        .max(1000)
        .optional(),

    notes: z
        .string()
        .trim()
        .max(2000)
        .optional(),
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.omit({ patient: true, visitDate: true, }).partial();