
'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

export default function PhotoGallery() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const { storage } = initializeFirebase();
        const imagesRef = ref(storage, 'placeholder-images');
        
        const res = await listAll(imagesRef);

        if (res.items.length > 0) {
          const urls = await Promise.all(
            res.items.map((itemRef) => getDownloadURL(itemRef))
          );
          setImageUrls(urls);
        } else {
          // Fallback to placeholder images if Firebase Storage folder is empty
          console.warn("No images in Firebase Storage, loading placeholders...");
          const fallbackUrls = [
            "https://picsum.photos/seed/before1/600/400",
            "https://picsum.photos/seed/after1/600/400",
            "https://picsum.photos/seed/before2/600/400",
            "https://picsum.photos/seed/after2/600/400",
            "https://picsum.photos/seed/before3/600/400",
            "https://picsum.photos/seed/after3/600/400",
          ];
          setImageUrls(fallbackUrls);
        }
      } catch (err) {
        console.error("Error fetching images from Firebase Storage:", err);
        setError("Could not load the image gallery. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
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
            {error && <p className="text-center text-destructive">{error}</p>}
            {!loading && !error && (
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
