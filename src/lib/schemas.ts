import { z } from "zod";

export const bookingFormSchema = z.object({
  serviceType: z.string(),
  propertyType: z.string(),
  bedrooms: z.string(),
  bathrooms: z.string(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  email: z.string().email("A valid email is required"),
  address: z.string().min(5, "Address is required"),
  preferredDate: z.date().optional(),
  notes: z.string().optional(),
  oven: z.boolean().optional(),
  fridge: z.boolean().optional(),
  trash: z.boolean().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
