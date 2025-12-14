import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] md:h-screen flex items-center justify-center text-center text-white py-0">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative z-10 container px-4 md:px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Move-Out & Deep Cleaning in Tallahassee
          </h1>
          <p className="text-lg text-gray-200 md:text-xl">
            Fast, flat-rate cleaning for apartments, homes, and rental properties.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/booking">Book a Cleaning</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Get a Free Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
