import { z } from "zod";

export const registerSchema = z.object({
     firstName: z.string().min(2, "First name is required"),
     lastName: z.string().min(2, "Last name is required"),
     email: z.string().email("Invalid email"),
     password: z.string().min(6, "Password must be at least 6 characters"),
     confirmPassword: z.string(),
     phone: z.string().min(6, "Phone is required"),
     dateOfBirth: z.string(),
     driverLicense: z.object({
          number: z.string().min(1, "License number is required"),
          expiryDate: z.string().min(1, "Expiry date is required"),
          issuingCountry: z.string().min(1, "Issuing country is required"),
     }),
     address: z.object({
          street: z.string().min(1, "Street address is required"),
          city: z.string().min(1, "City is required"),
          state: z.string().min(1, "State is required"),
          zipCode: z.string().min(1, "ZIP code is required"),
          country: z.string().min(1, "Country is required"),
     }),
}).refine((data) => data.password === data.confirmPassword, {
     path: ["confirmPassword"],
     message: "Passwords do not match",
});

export const loginSchema = z.object({
     email: z.string().email("Invalid email"),
     password: z.string().min(6, "Password is required"),
});
