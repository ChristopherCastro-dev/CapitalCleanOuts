import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Check } from "lucide-react";

const mapImage = PlaceHolderImages.find(img => img.id === 'service-area-map');
const serviceLocations = ["Tallahassee", "Florida State University (FSU)", "Florida A&M University (FAMU)", "Surrounding Neighborhoods"];

export default function ServiceArea() {
  return (
    <section className="bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              Serving Tallahassee, FL and Nearby Areas
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our cleaning crews are ready to serve you. We provide fast and reliable cleaning services across Tallahassee and the surrounding communities.
            </p>
            <ul className="grid gap-2 py-4">
              {serviceLocations.map((location) => (
                <li key={location}>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="font-medium">{location}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {mapImage && (
            <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                data-ai-hint={mapImage.imageHint}
                width={1280}
                height={800}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
