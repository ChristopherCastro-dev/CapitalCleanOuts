import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { services } from "@/lib/services";
import { Badge } from "../ui/badge";

export default function ServicesGrid() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {services.map((service, index) => (
        <AccordionItem key={service.title} value={`item-${index}`} className="border-b-0">
          <AccordionTrigger className="rounded-lg bg-card p-6 text-left hover:no-underline hover:bg-muted/50 data-[state=open]:rounded-b-none data-[state=open]:bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {service.icon}
              </div>
              <div>
                <h3 className="font-headline text-lg font-semibold">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 rounded-b-lg bg-card p-6">
            <p className="text-muted-foreground">{service.longDescription}</p>
            <div>
                <h4 className="font-semibold mb-2">Example Pricing:</h4>
                <div className="flex flex-wrap gap-2">
                    {service.pricingExamples.map(example => (
                        <Badge key={example.item} variant="secondary" className="text-sm">
                            <span className="font-normal mr-2">{example.item}:</span>
                            <span className="font-semibold">{example.price}</span>
                        </Badge>
                    ))}
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
