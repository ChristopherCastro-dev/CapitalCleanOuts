import { z } from "zod";

export const bookingFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  pickupTime: z.date().optional(),
  junkVolume: z.string(),
  junkPhoto: z.any().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
