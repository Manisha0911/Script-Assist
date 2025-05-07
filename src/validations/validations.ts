import { z } from 'zod';

export const LoginValidationSchema = z.object({ 
    email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[\W_]/, "Password must contain at least one special character (e.g., @, #, !, etc.)")
    .nonempty("Password is required"),
})