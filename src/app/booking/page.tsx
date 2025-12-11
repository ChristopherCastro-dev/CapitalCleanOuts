import { BookingPageClient } from "@/components/booking/booking-page-client";

export default function BookingPage() {
  return (
    <section className="bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Book Your Cleanout
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Get an instant estimate and schedule your junk removal in minutes.
            </p>
          </div>
        </div>
        <BookingPageClient />
      </div>
    </section>
  );
}
