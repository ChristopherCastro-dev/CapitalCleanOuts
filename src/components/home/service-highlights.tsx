import { Clock, ShieldCheck, Recycle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Same-Day Service",
    description: "Need it gone now? We offer same-day and next-day appointments to fit your schedule.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Licensed & Insured",
    description: "Our professional crew is fully licensed and insured for your peace of mind.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Professional Crew",
    description: "Our friendly, uniformed team will handle all the heavy lifting with a smile.",
  },
  {
    icon: <Recycle className="h-8 w-8 text-primary" />,
    title: "Eco-Friendly Disposal",
    description: "We donate and recycle up to 70% of the items we collect, keeping them out of landfills.",
  },
];

export default function ServiceHighlights() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => (
            <Card key={highlight.title} className="flex flex-col items-center text-center p-6 border-0 bg-transparent shadow-none md:border md:bg-card md:shadow-sm">
              <CardHeader className="p-0">
                {highlight.icon}
              </CardHeader>
              <CardContent className="p-0 mt-4 space-y-2">
                <CardTitle className="font-headline text-lg">{highlight.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
