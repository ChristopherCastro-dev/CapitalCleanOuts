import { Book, Truck, Sparkles } from "lucide-react";

const processSteps = [
  {
    icon: <Book className="h-10 w-10 text-primary" />,
    title: "1. Book Online or Call",
    description: "Get a free, no-obligation quote online or over the phone. Pick a time that works for you, and we'll be there.",
  },
  {
    icon: <Truck className="h-10 w-10 text-primary" />,
    title: "2. We Arrive & Haul",
    description: "Our professional, uniformed crew will arrive on time, confirm the price, and get to work hauling your junk.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "3. We Dispose Responsibly",
    description: "We sort your items for donation, recycling, and responsible disposal, keeping junk out of landfills.",
  },
];

export default function OurProcess() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              How Our Cleanout Process Works
            </h2>
            <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Three simple steps to a clutter-free space.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 grid items-start gap-8 sm:max-w-4xl sm:grid-cols-3 md:gap-12">
          {processSteps.map((step) => (
            <div key={step.title} className="grid gap-2 text-center">
              <div className="flex justify-center">{step.icon}</div>
              <h3 className="text-lg font-bold font-headline">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
