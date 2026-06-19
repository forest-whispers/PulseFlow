import z from "zod";

export const createLabResultSchema = z.object({
    medicalRecord: z.string(),

    testName: z.string().trim().min(2).max(200),

    resultSummary: z.string().trim().max(2000).optional(),
});

export const updateLabResultSchema = z.object({
    testName: z.string().trim().min(2).max(200).optional(),

    resultSummary: z.string().trim().max(2000).optional(),
});