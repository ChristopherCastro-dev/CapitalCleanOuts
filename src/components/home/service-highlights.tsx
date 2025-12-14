import { CalendarClock, BadgeDollarSign, School, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    icon: <CalendarClock className="h-8 w-8 text-primary" />,
    title: "Same-Week Availability",
    description: "Need a cleaning soon? We offer flexible scheduling to fit your tight timelines.",
  },
  {
    icon: <BadgeDollarSign className="h-8 w-8 text-primary" />,
    title: "Flat-Rate Pricing",
    description: "No surprises. Know the cost of your cleaning upfront with our simple, flat-rate pricing.",
  },
  {
    icon: <School className="h-8 w-8 text-primary" />,
    title: "Student & Rental Specialists",
    description: "We specialize in move-out cleanings for students and rental properties to help you get your deposit back.",
  },
  {
    icon: <Star className="h-8 w-8 text-primary" />,
    title: "Trusted Local Service",
    description: "We're a local Tallahassee business committed to providing a reliable, high-quality clean every time.",
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
