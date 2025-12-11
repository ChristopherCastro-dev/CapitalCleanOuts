
"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { truckSizes } from "@/lib/constants";
import { useFormContext } from "react-hook-form";
import type { BookingFormValues } from "@/lib/schemas";

export default function JunkEstimator() {
  const form = useFormContext<BookingFormValues>();
  const defaultIndex = truckSizes.findIndex(size => size.label === form.getValues('junkVolume')) || 1;
  const [sliderValue, setSliderValue] = useState(defaultIndex);

  const selectedSize = truckSizes[sliderValue];

  const handleValueChange = (value: number[]) => {
    const newIndex = value[0];
    const newSize = truckSizes[newIndex];
    setSliderValue(newIndex);
    if (form) {
      form.setValue('junkVolume', newSize.label, { shouldValidate: true });
      form.setValue('price', newSize.price, { shouldValidate: true });
    }
  };

  return (
    <Card className="w-full sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">1. Estimate Your Junk Volume</CardTitle>
        <CardDescription>Drag the slider to get an instant price estimate.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        <div className="flex justify-center">
            <div className="relative h-32 w-64">
                <div className="absolute bottom-0 left-0 h-full w-full bg-muted rounded-md border-2 border-dashed border-border"></div>
                <div 
                    className="absolute bottom-0 left-0 bg-primary/80 rounded-md transition-all duration-300"
                    style={{ height: '100%', width: selectedSize.fill }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xl font-bold text-primary-foreground drop-shadow-md">{selectedSize.label}</p>
                </div>
            </div>
        </div>
        <Slider
          value={[sliderValue]}
          defaultValue={[defaultIndex]}
          min={0}
          max={truckSizes.length - 1}
          step={1}
          onValueChange={handleValueChange}
        />
        <p className="text-center text-sm text-muted-foreground">
          {selectedSize.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-2 rounded-b-lg bg-muted/50 p-6">
        <p className="text-sm text-muted-foreground">Estimated Price</p>
        <p className="font-headline text-4xl font-bold text-primary">{selectedSize.price}</p>
        <p className="text-xs text-muted-foreground">Final price confirmed on-site. No hidden fees.</p>
      </CardFooter>
    </Card>
  );
}

    