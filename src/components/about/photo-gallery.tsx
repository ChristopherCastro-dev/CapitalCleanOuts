
'use client';

import { Card } from '@/components/ui/card';
import ImagePairSlider from './image-pair-slider';

const imagePairs = [
  { before: "https://i.ibb.co/SXyc7dKn/Screenshot-2025-12-13-at-11-35-42-PM.png", after: "https://i.ibb.co/3m1mtZns/Screenshot-2025-12-13-at-11-36-16-PM.png", alt: "Kitchen Cleaning Before and After" },
  { before: "https://i.ibb.co/kgS29cLN/Screenshot-2025-12-13-at-11-40-35-PM.png", after: "https://i.ibb.co/GvQWgjz2/Screenshot-2025-12-13-at-11-40-52-PM.png", alt: "Bathroom Sink Cleaning Before and After" },
  { before: "https://i.ibb.co/4ws3cP7y/Screenshot-2025-12-13-at-11-43-16-PM.png", after: "https://i.ibb.co/nMr22d87/Screenshot-2025-12-13-at-11-43-35-PM.png", alt: "Shower Cleaning Before and After" },
  { before: "https://i.ibb.co/wNYj9kP9/Screenshot-2025-12-13-at-11-45-33-PM.png", after: "https://i.ibb.co/b5WRzD0z/Screenshot-2025-十二月-13-at-11-45-49-PM.png", alt: "Living Room Cleaning Before and After" },
  { before: "https://i.ibb.co/gFm97Bv6/Screenshot-2025-12-13-at-11-47-35-PM.png", after: "https://i.ibb.co/Cpk2DgCY/Screenshot-2025-12-13-at-11-47-52-PM.png", alt: "Floor Cleaning Before and After" },
  { before: "https://i.ibb.co/Cs592Tgc/Screenshot-2025-12-13-at-11-49-36-PM.png", after: "https://i.ibb.co/zVyQk5hK/Screenshot-2025-12-13-at-11-50-01-PM.png", alt: "Stove Top Cleaning Before and After" },
];


export default function PhotoGallery() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              Before & After Photo Gallery
            </h2>
            <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See the Capital CleanOuts difference for yourself. Drag the sliders to reveal the transformation.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {imagePairs.map((pair, index) => (
                    <Card key={index} className="overflow-hidden">
                        <ImagePairSlider 
                            beforeImageUrl={pair.before}
                            afterImageUrl={pair.after}
                            alt={pair.alt}
                        />
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
