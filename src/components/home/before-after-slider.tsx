"use client";

import { useState } from "react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "../ui/card";

const beforeImage = PlaceHolderImages.find(img => img.id === 'before-junk');
const afterImage = PlaceHolderImages.find(img => img.id === 'after-junk');

export default function BeforeAfterSlider() {
  const [sliderValue, setSliderValue] = useState(50);

  if (!beforeImage || !afterImage) return null;

  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              See the JUNKXPRESS Difference
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Drag the slider to see the transformation. From cluttered to clean, just like that.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
            <Card className="p-2 md:p-4">
                <div 
                    className="relative w-full aspect-video overflow-hidden rounded-md" 
                    style={{ '--clip-percent': `${sliderValue}%` } as React.CSSProperties}
                >
                    <Image
                        src={beforeImage.imageUrl}
                        alt={beforeImage.description}
                        data-ai-hint={beforeImage.imageHint}
                        fill
                        className="object-cover"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ clipPath: 'inset(0 calc(100% - var(--clip-percent)) 0 0)' }}
                    >
                        <Image
                            src={afterImage.imageUrl}
                            alt={afterImage.description}
                            data-ai-hint={afterImage.imageHint}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div 
                        className="absolute inset-y-0 bg-background/50 backdrop-blur-sm"
                        style={{
                            left: `calc(${sliderValue}% - 2px)`,
                            width: '4px',
                            cursor: 'ew-resize'
                        }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 border-2 border-primary flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                    </div>
                </div>
                <Slider
                    defaultValue={[50]}
                    onValueChange={(value) => setSliderValue(value[0])}
                    className="mt-4"
                />
            </Card>
        </div>
      </div>
    </section>
  );
}
