import { Home, Trash2, Archive, Building2, Trees, Sofa, Construction, ShieldAlert } from 'lucide-react';

export const services = [
  {
    icon: <Home className="h-6 w-6" />,
    title: "Home Cleanouts",
    shortDescription: "Full house, apartment, and estate cleanouts.",
    longDescription: "Whether you're moving, downsizing, or just decluttering, we handle everything from attics to basements. We'll sort, remove, and haul away all unwanted items, leaving your home spacious and clean.",
    pricingExamples: [
      { item: "Single Room", price: "$150+" },
      { item: "Whole Apartment", price: "$400+" },
    ],
  },
  {
    icon: <Trash2 className="h-6 w-6" />,
    title: "Garage Cleanouts",
    shortDescription: "Reclaim your garage from clutter.",
    longDescription: "Turn your packed garage back into a functional space. We take old tools, boxes, sports equipment, and anything else that's taking up valuable real estate.",
    pricingExamples: [
      { item: "Small Clutter", price: "$125+" },
      { item: "Full Garage", price: "$350+" },
    ],
  },
  {
    icon: <Archive className="h-6 w-6" />,
    title: "Storage Unit Cleanouts",
    shortDescription: "Empty your storage unit hassle-free.",
    longDescription: "Stop paying for a storage unit you no longer need. We provide fast and efficient cleanouts, so you can close your account and save money.",
    pricingExamples: [
      { item: "5x5 Unit", price: "$100+" },
      { item: "10x20 Unit", price: "$300+" },
    ],
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Office & Commercial Cleanouts",
    shortDescription: "Efficient cleanouts for business spaces.",
    longDescription: "Upgrading office furniture, closing a location, or clearing out a retail space? We handle office desks, chairs, electronics, and commercial waste with minimal disruption to your business.",
     pricingExamples: [
      { item: "Single Office", price: "$200+" },
      { item: "Full Floor", price: "Call for Quote" },
    ],
  },
  {
    icon: <Trees className="h-6 w-6" />,
    title: "Yard Debris Removal",
    shortDescription: "Branches, leaves, and old patio furniture.",
    longDescription: "Post-hurricane cleanup or a big landscaping project? We haul away all types of yard waste, including branches, leaves, soil, and old outdoor furniture, so you can enjoy your yard again.",
    pricingExamples: [
      { item: "Bagged Debris", price: "$90+" },
      { item: "Large Branches", price: "$180+" },
    ],
  },
  {
    icon: <Sofa className="h-6 w-6" />,
    title: "Appliance & Furniture Haul-Away",
    shortDescription: "Single item or full set removal.",
    longDescription: "Getting a new sofa, mattress, or refrigerator? We'll safely remove your old, bulky items from anywhere in your home, so you don't have to lift a finger.",
    pricingExamples: [
      { item: "Mattress", price: "$80" },
      { item: "Sofa", price: "$100" },
    ],
  },
  {
    icon: <Construction className="h-6 w-6" />,
    title: "Construction Debris",
    shortDescription: "Post-renovation material cleanup.",
    longDescription: "Keep your job site clean and safe. We remove drywall, wood, tiles, concrete, and other construction materials, helping your project stay on schedule.",
    pricingExamples: [
      { item: "Small Pile", price: "$175+" },
      { item: "Full Truck", price: "$600" },
    ],
  },
  {
    icon: <ShieldAlert className="h-6 w-6" />,
    title: "Hoarder Cleanouts",
    shortDescription: "Sensitive and discreet property clearing.",
    longDescription: "We provide compassionate, respectful, and discreet cleanout services for hoarding situations. Our trained team works efficiently to restore the home to a safe and livable condition.",
    pricingExamples: [
      { item: "Assessment", price: "Free" },
      { item: "Full Service", price: "Call for Quote" },
    ],
  },
];
