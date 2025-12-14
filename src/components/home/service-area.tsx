import { Check } from "lucide-react";
import { contactDetails } from "@/lib/constants";

const serviceLocations = ["Tallahassee", "Florida State University (FSU)", "Florida A&M University (FAMU)", "Surrounding Neighborhoods"];

export default function ServiceArea() {
  return (
    <section className="bg-card">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
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
          <div className="h-[400px] w-full overflow-hidden rounded-xl">
            <iframe
              src={contactDetails.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
