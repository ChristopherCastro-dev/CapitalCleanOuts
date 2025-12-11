
'use client'

import { useState, useEffect } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
};

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMessages = async () => {
        try {
          const { firestore } = initializeFirebase();
          const messagesRef = collection(firestore, 'messages');
          const q = query(messagesRef, orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const fetchedMessages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Message[];
          setMessages(fetchedMessages);
        } catch (err) {
          console.error("Error fetching messages:", err);
          setError("Failed to load messages.");
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <section className="container flex h-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center font-headline text-2xl">Admin Access</CardTitle>
            <CardDescription className="text-center">Enter the password to view messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Contact Messages
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Here are the messages submitted through the contact form.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-muted-foreground">No messages yet.</p>
          ) : (
            messages.map(msg => (
              <Card key={msg.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{msg.name}</CardTitle>
                  <CardDescription>
                    <a href={`mailto:${msg.email}`} className="text-primary hover:underline">
                      {msg.email}
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{msg.message}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Received on: {format(msg.createdAt.toDate(), "PPP p")}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
