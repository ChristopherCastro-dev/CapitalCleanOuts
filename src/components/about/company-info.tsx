import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const whyJunkXpressImage = PlaceHolderImages.find(img => img.id === 'about-us-team');

export default function CompanyInfo() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why JUNKXPRESS?
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We started JUNKXPRESS to solve a simple problem: junk removal in Miami should be fast, affordable, and professional. We got tired of unreliable services and surprise fees. That's why we're committed to transparent pricing, on-time arrivals, and a friendly, uniformed crew you can trust.
            </p>
            <div className="space-y-4 pt-4">
              <h2 className="font-headline text-2xl font-bold tracking-tighter sm:text-3xl">Our Mission</h2>
              <p className="text-muted-foreground">
                Our mission is to provide the most efficient and eco-friendly junk removal service in South Florida. We aim to declutter your life while protecting the planet by donating and recycling up to 70% of the items we haul. We believe in clear communication, fair pricing, and leaving every space cleaner than we found it.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {whyJunkXpressImage && (
                <Image
                src={whyJunkXpressImage.imageUrl}
                alt={whyJunkXpressImage.description}
                data-ai-hint={whyJunkXpressImage.imageHint}
                width={600}
                height={400}
                className="aspect-[3/2] overflow-hidden rounded-xl object-cover"
                />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
