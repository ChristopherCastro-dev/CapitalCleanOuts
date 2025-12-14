import { Button } from "@/components/ui/button";
import { contactDetails, itHelpDetails } from "@/lib/constants";
import { Phone, MessageSquare } from "lucide-react";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      <Button asChild size="icon" className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg animate-pulse">
        <a href={`tel:${contactDetails.phones[0].number}`} aria-label="Call Now">
          <Phone className="h-6 w-6" />
        </a>
      </Button>
      <Button asChild size="icon" className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 text-white shadow-lg">
        <a href={contactDetails.whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <MessageSquare className="h-6 w-6" />
        </a>
      </Button>
    </div>
  );
}
