import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(3, "Name too short"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password too short"),
    role: z.enum(["patient", "doctor", "admin"]),
    age: z.number().min(1, "Invalid age"),
    gender: z.enum(["male", "female", "other"]),
});

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password too short"),
});