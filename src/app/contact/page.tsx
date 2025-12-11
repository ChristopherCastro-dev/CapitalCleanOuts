
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ContactInfo from '@/components/contact/contact-info';
import { contactDetails } from '@/lib/constants';
import ContactForm from '@/components/contact/contact-form';

export default function ContactPage() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Have questions? We're here to help. Contact us today for a free, no-obligation quote.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <ContactInfo />
            <div className="h-full min-h-[400px] w-full overflow-hidden rounded-lg">
               <iframe
                src={contactDetails.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

    