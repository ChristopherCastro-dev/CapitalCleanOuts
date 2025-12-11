import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { FloatingButtons } from '@/components/layout/floating-buttons';

export const metadata: Metadata = {
  title: 'JUNKXPRESS | Fast, Affordable Cleanouts in Miami',
  description: 'JUNKXPRESS offers fast, affordable, and eco-friendly junk removal and cleanout services in Miami, Broward, and surrounding areas. Same-day service available.',
  keywords: 'junk removal miami, cleanouts, furniture removal, construction debris, eviction cleanout, junkxpress',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <FloatingButtons />
        <Toaster />
      </body>
    </html>
  );
}
