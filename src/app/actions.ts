"use server";

import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  pickupTime: z.string().optional(),
  junkVolume: z.string(),
  junkPhoto: z.any().optional(),
});

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type BookingFormState = {
  message: string;
  errors?: {
    name?: string[];
    phone?: string[];
    address?: string[];
    pickupTime?: string[];
  };
  success: boolean;
};

export async function submitBooking(prevState: BookingFormState, formData: FormData): Promise<BookingFormState> {
  const validatedFields = bookingSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    pickupTime: formData.get("pickupTime"),
    junkVolume: formData.get("junkVolume"),
    junkPhoto: formData.get("junkPhoto"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  // Here you would typically handle the file upload to a service like Firebase Storage.
  // For now, we'll just log the file info.
  const junkPhoto = formData.get("junkPhoto") as File | null;
  if (junkPhoto && junkPhoto.size > 0) {
    console.log("Received photo:", junkPhoto.name, junkPhoto.type, junkPhoto.size, "bytes");
  }

  // Here you would save the data to a database like Firebase Firestore.
  console.log("Booking data:", validatedFields.data);

  // Simulate a delay for network request
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: "Booking request sent successfully! We will contact you shortly.",
    success: true,
  };
}


export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  success: boolean;
};


export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // Here you would save the data to a database like Firebase Firestore.
  console.log("Contact form data:", validatedFields.data);

  // Simulate a delay for network request
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: "Your message has been sent! We will get back to you soon.",
    success: true,
  };
}
