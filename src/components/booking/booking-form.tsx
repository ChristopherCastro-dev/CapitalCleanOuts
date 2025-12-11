"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Loader2, Upload } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { BookingFormValues } from "@/lib/schemas";


function SubmitButton({isSubmitting}: {isSubmitting: boolean}) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full text-lg">
      {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
      Book Now
    </Button>
  );
}

export default function BookingForm() {
  const { toast } = useToast();
  const form = useFormContext<BookingFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: BookingFormValues) => {
    setIsSubmitting(true);

    const processBooking = (photoDataUrl?: string) => {
      try {
        const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const newJob = {
          id: `job_${Date.now()}`,
          clientName: data.name,
          clientPhone: data.phone,
          address: data.address,
          status: 'Pending',
          date: data.pickupTime ? format(data.pickupTime, "yyyy-MM-dd") : new Date().toISOString().split('T')[0],
          photo: photoDataUrl,
          timestamp: Date.now(),
        };

        const updatedJobs = [newJob, ...existingJobs];
        localStorage.setItem('jobs', JSON.stringify(updatedJobs));

        // Dispatch custom event
        window.dispatchEvent(new Event('jobs-updated'));

        toast({
          title: "Success!",
          description: "Your booking has been received! We will contact you shortly.",
        });
        form.reset();

      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while submitting your booking. Please try again.",
          variant: "destructive",
        });
        console.error("Failed to save job to localStorage", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (data.junkPhoto instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        processBooking(e.target?.result as string);
      };
      reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast({
          title: "File Error",
          description: "Could not read the uploaded image. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
      reader.readAsDataURL(data.junkPhoto);
    } else {
      processBooking();
    }
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Confirm Your Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             <FormField
              control={form.control}
              name="junkVolume"
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 555-5555" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, Miami, FL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="pickupTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ideal Pickup Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0)) 
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="junkPhoto"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Upload Photo (Optional)</FormLabel>
                    <FormControl>
                        <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-card px-4 py-3 text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                            <Upload className="h-5 w-5" />
                            <span>{value?.name || 'Click to upload'}</span>
                            <Input
                                type="file"
                                className="sr-only"
                                {...rest}
                                onChange={(event) => {
                                onChange(event.target.files?.[0]);
                                }}
                                accept="image/*"
                            />
                        </label>
                    </FormControl>
                     <FormDescription>A photo helps us give a more accurate quote.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    