import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Please enter a valid name format.")
      .refine(
        (val) => /^[A-Za-z\s-]+$$/.test(val),
        "Please enter a valid name format."
      ),
    lastName: z
      .string()
      .min(2, "Please enter a valid name format.")
      .refine(
        (val) => /^[A-Za-z\s-]+$$/.test(val),
        "Please enter a valid name format."
      ),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(4, "4 characters minimum."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
