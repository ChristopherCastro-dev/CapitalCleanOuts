import ServicesGrid from "@/components/services/services-grid";

export default function ServicesPage() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Our Services
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              From single items to full property cleanouts, we handle it all. Explore our services to find the right fit for you.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <ServicesGrid />
        </div>
      </div>
    </section>
  );
}
