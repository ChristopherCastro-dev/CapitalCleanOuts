"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef } from "react";

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
import { submitBooking } from "@/app/actions";
import type { BookingFormValues } from "@/lib/schemas";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full text-lg">
      {pending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
      Book Now
    </Button>
  );
}

export default function BookingForm() {
  const [state, formAction] = useFormState(submitBooking, { message: "", success: false });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const form = useFormContext<BookingFormValues>();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        form.reset();
        formRef.current?.reset();
      }
    }
  }, [state, toast, form]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Confirm Your Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} action={formAction} className="space-y-8">
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
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
