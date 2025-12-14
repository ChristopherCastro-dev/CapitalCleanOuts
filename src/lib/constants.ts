
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

export const teamMembers = [
    {
      name: "Chris Castro",
      role: "Founder & CEO / Lead Cleaning Specialist",
      imageId: "team-member-1"
    },
    {
      name: "John Jimenez",
      role: "Operations Manager",
      imageId: "team-member-2"
    },
  ];

export const customerReviews = [
  { rating: 5, text: "Capital CleanOuts was a lifesaver! They did a move-out cleaning on my apartment and it passed inspection with no issues.", author: "Sarah L., Tallahassee" },
  { rating: 5, text: "Called them for a deep clean and my house has never looked better. Insanely good service. Highly recommend!", author: "Mike T., FSU Student" },
  { rating: 4.5, text: "Great service and flat-rate pricing is a huge plus. The team was professional and friendly. A+ service.", author: "Jennifer P., Midtown" },
  { rating: 5, text: "As a landlord, I use them for all my apartment turnovers. They are on time, efficient, and always do a fantastic job.", author: "David C., Property Manager" },
  { rating: 5, text: "The booking process was so easy, and the crew was incredibly professional. Made my move so much less stressful.", author: "Emily R., CollegeTown" },
];

export const contactDetails = {
    phones: [
      { number: "1-305-778-9397", display: "(305) 778-9397", owner: "Capital CleanOuts" },
    ],
    email: "Contact@capitalcleanouts.site",
    hours: [
        "Monday - Saturday: 8:00 AM - 6:00 PM",
        "Sunday: Closed"
    ],
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110198.3719875936!2d-84.3594437599298!3d30.45183354722524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88ecf5f5904f6a29%3A0x8f0c46a6f6f8955!2sTallahassee%2C%2FL!5e0!3m2!1sen!2sus!4v1717789999999!5m2!1sen!2sus",
    whatsappLink: "https://wa.me/13057789397"
};

export const itHelpDetails = {
    phone: "1-305-778-9397",
    phoneDisplay: "(305) 778-9397",
};

export const pricing = {
  base: {
    "Move-Out Cleaning": 150,
    "Deep Cleaning": 120,
    "Apartment Turnover": 140,
    "Office Cleaning": 100,
  },
  bedrooms: {
    "Studio": 0,
    "1": 20,
    "2": 40,
    "3": 60,
    "4+": 80,
  },
  bathrooms: {
    "1": 15,
    "2": 30,
    "3+": 45,
  },
  addOns: {
    oven: 25,
    fridge: 25,
    trash: 35,
  },
};

export type ServiceType = keyof typeof pricing.base;
export type Bedrooms = keyof typeof pricing.bedrooms;
export type Bathrooms = keyof typeof pricing.bathrooms;


export const truckSizes = []; // Removed as it's no longer relevant

