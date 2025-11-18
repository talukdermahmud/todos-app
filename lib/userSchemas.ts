import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  address: z
    .string()
    .min(5, "Address is too short")
    .optional()
    .or(z.literal("")),
  contactNumber: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number")
    .min(10, "Contact number too short")
    .optional()
    .or(z.literal("")),
  birthday: z.date({ message: "Please select your birthday" }).optional(),
  bio: z.string().optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
