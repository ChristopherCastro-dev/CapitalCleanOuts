
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AdminTrigger } from "./admin-trigger";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-colors duration-300 bg-slate-800 border-b border-slate-700">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="relative">
            <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold">
               <Image src="https://i.ibb.co/tp55SGfr/Untitled-design.png" alt="Capital CleanOuts Logo" width={32} height={32} className="h-8 w-8" />
              <span className="text-white">Capital CleanOuts</span>
            </Link>
            <AdminTrigger />
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-gray-200 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <Button asChild>
              <Link href="/booking">Book a Cleaning</Link>
            </Button>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background">
              <div className="flex flex-col p-6">
                  <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold mb-8" onClick={() => setIsOpen(false)}>
                      <Image src="https://i.ibb.co/tp55SGfr/Untitled-design.png" alt="Capital CleanOuts Logo" width={32} height={32} className="h-8 w-8" />
                      <span>Capital CleanOuts</span>
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
                  <Link href="/booking" onClick={() => setIsOpen(false)}>Book a Cleaning</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
