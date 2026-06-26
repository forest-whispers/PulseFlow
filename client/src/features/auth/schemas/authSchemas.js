import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  age: z
    .coerce
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be an integer")
    .positive("Age must be positive")
    .optional(),
  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Please select male, female, or other" }),
    }),
  role: z
    .enum(["patient", "doctor", "admin"], {
      errorMap: () => ({ message: "Please select patient, doctor, or admin" }),
    }),
})
