

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];



export const teamMembers = [
    {
      name: "Alex Martinez",
      role: "Founder & CEO",
      imageId: "team-member-1",
      phone: "786-205-7298"
    },
    {
      name: "Maria Rodriguez",
      role: "Operations Manager",
      imageId: "team-member-2",
      phone: "786-387-1153"
    },
    {
      name: "Carlos Vega",
      role: "Lead Crew Chief",
      imageId: "team-member-3",
    },
  ];

export const customerReviews = [
  { rating: 5, text: "JUNKXPRESS was a lifesaver! They cleared out my dad's entire house in one afternoon. So professional and fast.", author: "Sarah L., Coral Gables" },
  { rating: 5, text: "Called them in the morning and my old couch was gone by lunch. Insanely fast service. Highly recommend!", author: "Mike T., Fort Lauderdale" },
  { rating: 4.5, text: "Great service and fair pricing. They even swept the garage floor after they were done. A+ team.", author: "Jennifer P., Miami Beach" },
  { rating: 5, text: "Used them for a construction site cleanup. They were on time, efficient, and handled all the debris without any issues.", author: "David C., Homestead" },
  { rating: 5, text: "The booking process was so easy, and the crew was incredibly friendly and professional. Made my move so much less stressful.", author: "Emily R., Aventura" },
];

export const contactDetails = {
    phone: "1-786-205-7298",
    phoneDisplay: "(786) 205-7298",
    email: "contact@junkxpress.com",
    hours: [
        "Monday - Saturday: 7:00 AM - 7:00 PM",
        "Sunday: 9:00 AM - 5:00 PM"
    ],
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229988.6534575122!2d-80.36922896645803!3d25.78254530839841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0x9add025f82a70364!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1689999999999!5m2!1sen!2sus",
    whatsappLink: "https://wa.me/17862057298"
};

export const truckSizes = [
  {
    label: "Select volume",
    description: "Drag the slider to choose the amount of junk.",
    price: "$0",
    fill: "0%",
  },
  {
    label: "1/4 Truck Load",
    description: "Equivalent to 1 pickup truck bed. Good for a single appliance or a few items.",
    price: "$150",
    fill: "25%",
  },
  {
    label: "1/2 Truck Load",
    description: "Equivalent to 2-3 pickup truck beds. Perfect for a room cleanout or small renovation.",
    price: "$350",
    fill: "50%",
  },
  {
    label: "3/4 Truck Load",
    description: "Good for an apartment cleanout or garage declutter.",
    price: "$475",
    fill: "75%",
  },
  {
    label: "Full Truck Load",
    description: "Our largest load size. Ideal for a full house cleanout or major debris.",
    price: "$600",
    fill: "100%",
  },
];
