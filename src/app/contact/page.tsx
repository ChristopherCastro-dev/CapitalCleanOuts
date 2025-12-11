
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ContactInfo from '@/components/contact/contact-info';
import { contactDetails } from '@/lib/constants';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const newMsg = {
      id: `msg_${Date.now()}`,
      name,
      email,
      phone,
      message,
      timestamp: Date.now(),
      read: false,
    };
    messages.unshift(newMsg);
    localStorage.setItem('messages', JSON.stringify(messages));

    // Trigger dashboard update
    window.dispatchEvent(new Event('messages-updated'));

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    alert('Message sent!');
  };
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
             <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-lg bg-card p-6">
                <Input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
                <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                <Input placeholder="Phone (Optional)" value={phone} onChange={e=>setPhone(e.target.value)} />
                <Textarea placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} required />
                <Button type="submit" variant="default" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
