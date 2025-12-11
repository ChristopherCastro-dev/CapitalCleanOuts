
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const bookingFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  pickupTime: z.date().optional(),
  junkVolume: z.string(),
  price: z.string(),
  junkPhoto: z.any()
    .optional()
    .refine((files) => files?.length == 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => files?.length == 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

    