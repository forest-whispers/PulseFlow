import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(3, "Name too short"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password too short"),
    role: z.enum(["patient", "doctor", "admin"]).optional(),
    age: z.number().min(1, "Invalid age").optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
});

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password too short"),
});