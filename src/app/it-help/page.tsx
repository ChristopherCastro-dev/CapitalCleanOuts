import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itHelpDetails } from "@/lib/constants";
import { Phone } from "lucide-react";

export default function ITHelpPage() {
  return (
    <section>
      <div className="container flex h-[60vh] flex-col items-center justify-center px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              IT Help & Support
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              For technical assistance with the website or app, please contact IT support.
            </p>
          </div>
        </div>

        <Card className="mt-12 w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-center font-headline text-2xl">
                    Contact IT Support
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
                <div className="flex items-center gap-3 text-lg">
                    <Phone className="h-6 w-6 text-primary" />
                    <span>{itHelpDetails.phoneDisplay}</span>
                </div>
                <Button asChild size="lg">
                    <a href={`tel:${itHelpDetails.phone}`}>
                        <Phone className="mr-2 h-5 w-5" />
                        Call IT Help
                    </a>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                    This number is for technical support only. For booking or service questions, please use the main contact page.
                </p>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
