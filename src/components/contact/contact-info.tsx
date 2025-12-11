import { Button } from "@/components/ui/button";
import { contactDetails } from "@/lib/constants";
import { Phone, Mail, MessageSquare, Clock } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-semibold">Contact Information</h3>
        <p className="text-muted-foreground">
          Reach out to us through any of the methods below. We're ready to help!
        </p>
        <div className="space-y-3">
          <a href={`tel:${contactDetails.phone}`} className="flex items-center gap-3 group">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-foreground group-hover:text-primary transition-colors">{contactDetails.phoneDisplay}</span>
          </a>
          <a href={`mailto:${contactDetails.email}`} className="flex items-center gap-3 group">
            <Mail className="h-5 w-5 text-primary" />
            <span className="text-foreground group-hover:text-primary transition-colors">{contactDetails.email}</span>
          </a>
        </div>
      </div>
      <div className="space-y-4">
         <h3 className="font-headline text-xl font-semibold">Hours of Operation</h3>
         <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div className="text-foreground">
                {contactDetails.hours.map(line => <p key={line}>{line}</p>)}
            </div>
         </div>
      </div>
       <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="flex-1">
            <a href={`tel:${contactDetails.phone}`}>
              <Phone className="mr-2 h-5 w-5" />
              Click to Call
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary" className="flex-1">
            <a href={`sms:${contactDetails.phone}`}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Click to Text
            </a>
          </Button>
        </div>
    </div>
  );
}
