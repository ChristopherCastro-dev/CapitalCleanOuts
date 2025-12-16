import { Building, Sparkles, KeyRound, Briefcase, UtensilsCrossed } from 'lucide-react';

export const services = [
  {
    icon: <KeyRound className="h-6 w-6" />,
    title: "Move-Out / Move-In Cleaning",
    shortDescription: "For renters & property turnovers.",
    longDescription: "Thorough cleaning designed to meet landlord and apartment inspection standards. We cover kitchens, appliances (exterior), bathrooms, floors, baseboards, and remove bagged trash.",
    pricingExamples: [
      { item: "Studio/1-Bed", price: "$220+" },
      { item: "2-3 Beds", price: "$300+" },
    ],
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Deep Residential Cleaning",
    shortDescription: "Intensive cleaning for homes.",
    longDescription: "Ideal for first-time cleanings or homes that need extra attention. We go beyond the surface to eliminate grime, dust, and buildup, leaving your home exceptionally clean.",
    pricingExamples: [
      { item: "Standard Home", price: "$180+" },
      { item: "Large Home", price: "$350+" },
    ],
  },
  {
    icon: <Building className="h-6 w-6" />,
    title: "Apartment Turnovers",
    shortDescription: "For landlords & property managers.",
    longDescription: "Fast and reliable turnaround cleaning service to get your rental properties ready for the next tenant. We understand the need for speed and quality.",
    pricingExamples: [
      { item: "Per Unit", price: "Custom" },
      { item: "Bulk Discount", price: "Call for Quote" },
    ],
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: "Small Office Cleaning",
    shortDescription: "Weekly or bi-weekly service.",
    longDescription: "Maintain a professional and clean environment for your employees and clients with our reliable office cleaning services. We offer flexible contracts to suit your needs.",
    pricingExamples: [
      { item: "Weekly", price: "Contact Us" },
      { item: "Bi-Weekly", price: "Contact Us" },
    ],
  },
  {
    icon: <UtensilsCrossed className="h-6 w-6" />,
    title: "Restaurant & Food-Service Detailing",
    shortDescription: "Inspection-ready cleaning for kitchens.",
    longDescription: "Specialized deep cleaning for restaurants and commercial kitchens. Our team is Food Handler Safety Certified and trained in food-safe cleaning practices to deliver an inspection-ready result. We focus on reliability and transparent, flat-rate pricing.",
    pricingExamples: [
      { item: "Kitchen Detailing", price: "Request Quote" },
      { item: "Contract Cleaning", price: "Call for Quote" },
    ],
  },
];
