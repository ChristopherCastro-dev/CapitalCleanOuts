import { Book, Sparkles, CheckCircle } from "lucide-react";

const processSteps = [
  {
    icon: <Book className="h-10 w-10 text-primary" />,
    title: "1. Book Online",
    description: "Fill out our simple form with your cleaning needs and pick a preferred date. We'll confirm the details and pricing with you.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "2. We Clean",
    description: "Our professional, vetted cleaning crew will arrive on time and perform a thorough, top-to-bottom cleaning.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
    title: "3. You Pass Inspection",
    description: "Enjoy a spotless space. We specialize in move-out cleanings designed to meet strict landlord standards.",
  },
];

export default function OurProcess() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              How Our Cleaning Process Works
            </h2>
            <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Three simple steps to a sparkling clean property.
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
