"use client";

import { useForm } from "react-hook-form";
import { FormProvider } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import JunkEstimator from "./junk-estimator";
import BookingForm from "./booking-form";
import { bookingFormSchema, type BookingFormValues } from "@/lib/schemas";
import { truckSizes } from "@/lib/constants";

export function BookingPageClient() {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      junkVolume: truckSizes.find(size => size.fill === '25%')?.label || "1/4 Truck Load",
    },
  });

  return (
    <FormProvider {...form}>
      <div className="mx-auto mt-12 grid max-w-5xl gap-12">
        <JunkEstimator />
        <BookingForm />
      </div>
    </FormProvider>
  );
}
