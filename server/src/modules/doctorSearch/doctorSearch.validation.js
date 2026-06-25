import { z } from "zod";

export const doctorSearchQuerySchema = z.object({
    specialization: z.string().optional(),
    minFee: z.coerce.number().min(0).optional(),
    maxFee: z.coerce.number().min(0).optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    sortBy: z.enum([
        "consultationFee",
        "experience",
    ]).optional(),
    order: z.enum([
        "asc",
        "desc",
    ]).optional(),
    search: z.string().optional(),
});