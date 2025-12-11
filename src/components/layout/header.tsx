
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Truck } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '1234';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdminAccess = () => {
    setShowAdminModal(true);
  };

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setError('');
      setPassword('');
      setShowAdminModal(false);
      router.push('/admin');
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
      )}>
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="relative">
            <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold">
              <Truck className="h-7 w-7 text-primary" />
              <span>JUNKXPRESS</span>
            </Link>
            <button
              onClick={handleAdminAccess}
              className="absolute inset-0 z-10 h-full w-full bg-black opacity-0"
              aria-label="Open Admin Login"
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

      <AlertDialog open={showAdminModal} onOpenChange={setShowAdminModal}>
        <AlertDialogContent className="bg-[#111] border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold text-[#1AB16A]">
              Admin Access
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-400">
              Enter passcode to unlock the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="bg-black border-[#1AB16A]/50 text-white focus:ring-[#1AB16A] text-center"
              />
              {error && <p className="text-sm font-medium text-red-500 text-center">{error}</p>}
            </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {setError(''); setPassword('');}} className="bg-gray-700 hover:bg-gray-600 border-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordSubmit} className="bg-[#1AB16A] text-black font-bold hover:bg-[#1AB16A]/80">Unlock</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
