import z from "zod";

export const createInvoiceSchema = z.object({
    appointment: z.string(),

    amount: z.number().positive(),

    description: z.string().trim().max(1000).optional(),

    paymentMethod: z.enum(["stripe", "cash"]).optional(),
});

export const updateInvoiceSchema = z.object({
    amount: z.number().positive().optional(),

    description: z.string().trim().max(1000).optional(),
});