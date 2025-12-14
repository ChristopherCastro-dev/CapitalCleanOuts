
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

// A predefined list of high-quality placeholder images from the web.
const placeholderImageUrls = [
    "https://i.ibb.co/bjnLQJDL/Untitled-design.jpg", // Messy kitchen
    "https://i.ibb.co/rVLJVxR/Untitled-design-1.jpg", // Clean kitchen
    "https://i.ibb.co/3fdD0N3/dirty-bathroom.jpg", // Dirty bathroom
    "https://i.ibb.co/qY0yKq9/clean-bathroom.jpg", // Clean bathroom
    "https://i.ibb.co/1nCyzcT/messy-living-room.jpg", // Messy living room
    "https://i.ibb.co/gDFw3M7/clean-living-room.jpg", // Clean living room
];

export default function PhotoGallery() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We are now using a static list of URLs instead of fetching from Firebase.
    setImageUrls(placeholderImageUrls);
    setLoading(false);
  }, []);

  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              Before & After Photo Gallery
            </h2>
            <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See the Capital CleanOuts difference for yourself.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
            {loading && <p className="text-center">Loading gallery...</p>}
            {!loading && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {imageUrls.map((url, index) => (
                        <Card key={index} className="overflow-hidden">
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={url}
                                    alt={`Cleaning result ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
