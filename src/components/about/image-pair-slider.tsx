
"use client";

import { useState } from "react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";

type ImagePairSliderProps = {
    beforeImageUrl: string;
    afterImageUrl: string;
    alt: string;
}

export default function ImagePairSlider({ beforeImageUrl, afterImageUrl, alt }: ImagePairSliderProps) {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="p-2">
        <div 
            className="relative w-full aspect-video overflow-hidden rounded-md" 
            style={{ '--clip-percent': `${sliderValue}%` } as React.CSSProperties}
        >
            <Image
                src={beforeImageUrl}
                alt={`Before - ${alt}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div
                className="absolute inset-0"
                style={{ clipPath: 'inset(0 calc(100% - var(--clip-percent)) 0 0)' }}
            >
                <Image
                    src={afterImageUrl}
                    alt={`After - ${alt}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 border-2 border-primary flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
            </div>
        </div>
        <Slider
            defaultValue={[50]}
            onValueChange={(value) => setSliderValue(value[0])}
            className="mt-4"
        />
    </div>
  );
}
