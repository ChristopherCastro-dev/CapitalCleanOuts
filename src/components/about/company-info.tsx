
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

const whyImage = PlaceHolderImages.find(img => img.id === 'about-us-team');

export default function CompanyInfo() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Capital CleanOuts?
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We started Capital CleanOuts to solve a simple problem: finding reliable, high-quality cleaning services in Tallahassee shouldn't be a hassle. We specialize in move-out and deep cleanings, offering transparent, flat-rate pricing you can trust.
            </p>
            <div className="space-y-4 pt-4">
              <h2 className="font-headline text-2xl font-bold tracking-tighter sm:text-3xl">Our Mission</h2>
              <p className="text-muted-foreground">
                Capital CleanOuts provides reliable, flat-rate cleaning services for renters, homeowners, and property managers in Tallahassee. Our mission is to deliver a spotless space, on time, every time, helping our clients pass inspections and enjoy a fresh start.
              </p>
            </div>
             <div className="space-y-4 pt-4">
              <h2 className="font-headline text-2xl font-bold tracking-tighter sm:text-3xl flex items-center gap-2">
                <ShieldCheck className="h-7 w-7 text-primary" />
                Commitment to Safety
              </h2>
              <p className="text-muted-foreground">
                For our restaurant and commercial clients, our team is Food Handler Safety Certified. This training ensures we understand the requirements for food-safe environments, allowing us to deliver a professional clean you can depend on.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {whyImage && (
                <Image
                src={whyImage.imageUrl}
                alt={whyImage.description}
                data-ai-hint={whyImage.imageHint}
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
