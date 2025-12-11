
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { truckSizes } from "@/lib/constants";
import { Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BookingPage() {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();
  const [junkVolumeIndex, setJunkVolumeIndex] = useState(1); // Default to 1/4 load
  const [status, setStatus] = useState<'Pending'|'In Progress'|'Completed'>('Pending');

  const selectedSize = truckSizes[junkVolumeIndex];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };
  
  const handleSliderChange = (value: number[]) => {
    setJunkVolumeIndex(value[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const newJob = {
      id: `job_${Date.now()}`,
      clientName,
      clientPhone,
      address,
      status,
      date,
      junkVolume: selectedSize.label,
      price: selectedSize.price,
      photo,
      timestamp: Date.now(),
    };
    jobs.unshift(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));

    // Trigger dashboard update
    window.dispatchEvent(new Event('jobs-updated'));

    // Reset form
    setClientName('');
    setClientPhone('');
    setAddress('');
    setDate('');
    setPhoto(undefined);
    setJunkVolumeIndex(1);
    setStatus('Pending');

    alert('Booking submitted!');
  };

  return (
    <section className="bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Book Your Cleanout
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Get an instant estimate and schedule your junk removal in minutes.
            </p>
          </div>
        </div>
        
        <div className="mx-auto mt-12 grid max-w-2xl gap-12">
            {/* Junk Estimator */}
            <Card className="w-full">
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
                  value={[junkVolumeIndex]}
                  defaultValue={[1]}
                  min={0}
                  max={truckSizes.length - 1}
                  step={1}
                  onValueChange={handleSliderChange}
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

            {/* Booking Form */}
             <Card className="w-full">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">2. Schedule Your Pickup</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input placeholder="Client Name" value={clientName} onChange={e=>setClientName(e.target.value)} required />
                      <Input placeholder="Client Phone" value={clientPhone} onChange={e=>setClientPhone(e.target.value)} required />
                      <Input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} required />
                      <Input type="date" value={date} onChange={e=>setDate(e.target.value)} required />
                       <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-card px-4 py-3 text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                          <Upload className="h-5 w-5" />
                          <span>{photo ? 'Photo selected' : 'Upload Photo (Optional)'}</span>
                          <Input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only"/>
                       </label>
                      <Button type="submit" variant="default" className="w-full">Book Now</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
