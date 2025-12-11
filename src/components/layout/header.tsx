
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Truck } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdminAccess = () => {
    const password = prompt("Enter admin passcode:");
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "password")) {
      router.push("/admin");
    } else if (password !== null) {
      toast({
        title: "Access Denied",
        description: "Incorrect passcode.",
        variant: "destructive",
      });
    }
  };


  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
    )}>
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <div className="relative flex items-center gap-2 font-headline text-2xl font-bold">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-primary" />
            <span>JUNKXPRESS</span>
          </Link>
          <button
            onClick={handleAdminAccess}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer bg-black/0"
            aria-label="Admin Access"
          />
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Button asChild>
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs bg-background">
            <div className="flex flex-col p-6">
                <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold mb-8" onClick={() => setIsOpen(false)}>
                    <Truck className="h-7 w-7 text-primary" />
                    <span>JUNKXPRESS</span>
                </Link>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Button asChild className="mt-8" size="lg">
                <Link href="/booking" onClick={() => setIsOpen(false)}>Book Now</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
