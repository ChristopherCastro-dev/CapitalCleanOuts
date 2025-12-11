
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import JunkEstimator from "./junk-estimator";
import BookingForm from "./booking-form";
import { bookingFormSchema, type BookingFormValues } from "@/lib/schemas";
import { truckSizes } from "@/lib/constants";

export function BookingPageClient() {
  const defaultSize = truckSizes.find(size => size.fill === '25%');

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      junkVolume: defaultSize?.label || "1/4 Truck Load",
      price: defaultSize?.price || "$150",
    },
  });

  return (
    <FormProvider {...form}>
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
        <JunkEstimator />
        <BookingForm />
      </div>
    </FormProvider>
  );
}

    