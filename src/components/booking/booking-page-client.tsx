
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BookingForm from "./booking-form";
import { bookingFormSchema, type BookingFormValues } from "@/lib/schemas";

export function BookingPageClient() {

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      serviceType: "Move-Out Cleaning",
      propertyType: "Apartment",
      bedrooms: "1",
      bathrooms: "1",
    },
  });

  return (
    <FormProvider {...form}>
      <div className="mx-auto mt-12 max-w-2xl">
        <BookingForm />
      </div>
    </FormProvider>
  );
}
