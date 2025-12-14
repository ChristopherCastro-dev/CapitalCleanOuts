
"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Loader2, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BookingFormValues } from "@/lib/schemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { pricing } from "@/lib/constants";
import { usePriceCalculator } from "@/hooks/use-price-calculator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full text-lg">
      {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
      Submit Cleaning Request
    </Button>
  );
}

function PriceEstimator() {
    const { base, bedrooms, bathrooms, addOns, total } = usePriceCalculator();
  
    const formatCurrency = (amount: number) =>
      amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
  
    if (total === 0) return null;
  
    return (
      <div className="mt-8 rounded-lg bg-muted p-6">
        <h3 className="font-headline text-xl font-semibold mb-4">Estimated Price</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Base Service:</span> <span>{formatCurrency(base)}</span></div>
          {bedrooms > 0 && <div className="flex justify-between"><span>Bedrooms:</span> <span>+ {formatCurrency(bedrooms)}</span></div>}
          {bathrooms > 0 && <div className="flex justify-between"><span>Bathrooms:</span> <span>+ {formatCurrency(bathrooms)}</span></div>}
          {addOns > 0 && <div className="flex justify-between"><span>Add-Ons:</span> <span>+ {formatCurrency(addOns)}</span></div>}
          <div className="border-t border-border/50 my-2"></div>
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Total Estimate:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          This is an estimate. Final price will be confirmed upon review.
        </p>
      </div>
    );
  }

export default function BookingForm() {
  const { toast } = useToast();
  const form = useFormContext<BookingFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);

    if (typeof window !== 'undefined') {
      try {
        const jobs = JSON.parse(window.localStorage.getItem('jobs') || '[]');
        const newJob = {
            id: `job-${Date.now()}`,
            clientName: data.name,
            clientPhone: data.phone,
            email: data.email,
            address: data.address,
            serviceType: data.serviceType,
            propertyType: data.propertyType,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            notes: data.notes || '',
            status: 'Pending' as const,
            date: data.preferredDate ? format(data.preferredDate, "PPP") : 'Not specified',
            timestamp: Date.now(),
        };
        jobs.unshift(newJob); // Add to the beginning of the array
        window.localStorage.setItem('jobs', JSON.stringify(jobs));
        window.dispatchEvent(new Event('local-storage-changed'));

        toast({
          title: "Request Sent!",
          description: "We'll confirm pricing and availability shortly. Your request has been saved.",
        });
        form.reset();
      } catch (error) {
        console.error("Failed to save job to localStorage", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not save your request. Please try again.",
        });
      }
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Cleaning Request & Price Estimator</CardTitle>
        <CardDescription>Select your options to get an instant price estimate, then fill out your details to book.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Move-Out Cleaning">Move-Out Cleaning</SelectItem>
                        <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                        <SelectItem value="Apartment Turnover">Apartment Turnover</SelectItem>
                        <SelectItem value="Office Cleaning">Office Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select bedrooms" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Studio">Studio</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select bathrooms" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3+">3+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Optional Add-Ons</FormLabel>
              <div className="mt-2 space-y-3 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="oven"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          Inside Oven Cleaning (+${pricing.addOns.oven})
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="fridge"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          Inside Fridge Cleaning (+${pricing.addOns.fridge})
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="trash"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center gap-2">
                            <FormLabel className="font-normal text-sm">
                                Bagged Trash Removal (+${pricing.addOns.trash})
                            </FormLabel>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-[200px] text-xs">We will remove up to 5 standard kitchen-sized trash bags that are already bagged.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <PriceEstimator />

            <hr className="border-border/50" />
            
            <div className="space-y-2 text-center">
                <h3 className="font-headline text-xl">Your Contact Information</h3>
                <p className="text-sm text-muted-foreground">This information is required to confirm your booking.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="(555) 555-5555" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Address</FormLabel>
                  <FormControl><Input placeholder="123 N. Adams St, Tallahassee, FL" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Preferred Date (Optional)</FormLabel>
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
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Anything we should know? e.g., pets, specific areas to focus on..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    