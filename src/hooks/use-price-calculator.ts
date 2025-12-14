
"use client";

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { pricing, ServiceType, Bedrooms, Bathrooms } from '@/lib/constants';
import type { BookingFormValues } from '@/lib/schemas';

type PriceBreakdown = {
  base: number;
  bedrooms: number;
  bathrooms: number;
  addOns: number;
  total: number;
};

export function usePriceCalculator() {
  const { watch } = useFormContext<BookingFormValues>();
  const [breakdown, setBreakdown] = useState<PriceBreakdown>({
    base: 0,
    bedrooms: 0,
    bathrooms: 0,
    addOns: 0,
    total: 0,
  });

  const serviceType = watch("serviceType");
  const bedrooms = watch("bedrooms");
  const bathrooms = watch("bathrooms");
  const oven = watch("oven");
  const fridge = watch("fridge");
  const trash = watch("trash");

  useEffect(() => {
    const basePrice = pricing.base[serviceType as ServiceType] || 0;
    const bedroomsPrice = pricing.bedrooms[bedrooms as Bedrooms] || 0;
    const bathroomsPrice = pricing.bathrooms[bathrooms as Bathrooms] || 0;

    let addOnsPrice = 0;
    if (oven) addOnsPrice += pricing.addOns.oven;
    if (fridge) addOnsPrice += pricing.addOns.fridge;
    if (trash) addOnsPrice += pricing.addOns.trash;

    setBreakdown({
      base: basePrice,
      bedrooms: bedroomsPrice,
      bathrooms: bathroomsPrice,
      addOns: addOnsPrice,
      total: basePrice + bedroomsPrice + bathroomsPrice + addOnsPrice,
    });
    
  }, [serviceType, bedrooms, bathrooms, oven, fridge, trash]);

  return breakdown;
}
