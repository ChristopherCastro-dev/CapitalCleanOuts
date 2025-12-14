import { navLinks } from "@/lib/constants";
import Link from "next/link";
import { Button } from "../ui/button";
import { services } from "@/lib/services";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 px-4 py-12 md:px-6">
        <div className="grid gap-2 col-span-2 md:col-span-1">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">
            Capital CleanOuts
          </Link>
          <p className="text-sm text-muted-foreground">
            Move-Out & Property Cleaning
          </p>
        </div>
        <div className="grid gap-2">
          <h3 className="font-semibold text-foreground">Quick Links</h3>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="grid gap-2">
          <h3 className="font-semibold text-foreground">Services</h3>
          {services.slice(0, 4).map((service) => (
            <Link key={service.title} href="/services" className="text-sm text-muted-foreground hover:text-primary">
              {service.title}
            </Link>
          ))}
        </div>
        <div className="grid gap-2">
          <h3 className="font-semibold text-foreground">Get Started</h3>
          <p className="text-sm text-muted-foreground">Ready for a spotless space? Get a free estimate today.</p>
          <Button asChild>
            <Link href="/booking">Book a Cleaning</Link>
          </Button>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-4 md:px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Capital CleanOuts. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
             <Link href="#" className="text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
