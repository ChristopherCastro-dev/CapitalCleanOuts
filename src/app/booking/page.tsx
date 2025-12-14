
"use client";
import { BookingPageClient } from "@/components/booking/booking-page-client";

export default function BookingPage() {
  return (
    <section className="bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Book Your Cleaning
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Use our estimator to get a price and schedule your service in minutes.
            </p>
          </div>
        </div>
        <BookingPageClient />
      </div>
    </section>
  );
}
