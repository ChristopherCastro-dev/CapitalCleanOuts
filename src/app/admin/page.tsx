
'use client'

import { useState, useEffect, useMemo } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, orderBy, query, Timestamp, doc, updateDoc, deleteDoc, where, getCountFromServer } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format, isToday } from 'date-fns';
import { Trash2, Eye, EyeOff, Search, Inbox, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  isRead: boolean;
};

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [todayCount, setTodayCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setIsSyncing(true);
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

      const todayQuery = query(messagesRef, where('createdAt', '>=', new Date(new Date().setHours(0, 0, 0, 0))));
      const todaySnapshot = await getCountFromServer(todayQuery);
      setTodayCount(todaySnapshot.data().count);
      
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast({ title: "Error", description: "Failed to load messages.", variant: "destructive" });
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
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

  const toggleReadStatus = async (message: Message) => {
    const { firestore } = initializeFirebase();
    const messageRef = doc(firestore, 'messages', message.id);
    try {
      await updateDoc(messageRef, { isRead: !message.isRead });
      const updatedMessages = messages.map(m => m.id === message.id ? { ...m, isRead: !m.isRead } : m);
      setMessages(updatedMessages);
      if(selectedMessage?.id === message.id) {
        setSelectedMessage({...message, isRead: !message.isRead});
      }
      toast({ title: "Success", description: `Message marked as ${!message.isRead ? 'read' : 'unread'}.` });
    } catch (error) {
      toast({ title: "Error", description: "Could not update message status.", variant: "destructive" });
    }
  };

  const deleteMessage = async (id: string) => {
    const { firestore } = initializeFirebase();
    const messageRef = doc(firestore, 'messages', id);
    try {
      await deleteDoc(messageRef);
      setMessages(messages.filter(m => m.id !== id));
      setSelectedMessage(null);
      toast({ title: "Success", description: "Message deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Could not delete message.", variant: "destructive" });
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);
  
  const unreadCount = useMemo(() => messages.filter(m => !m.isRead).length, [messages]);


  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black p-4">
        <Card className="w-full max-w-md bg-[#111] border-[#1AB16A]/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-[#1AB16A]">
              ADMIN ACCESS
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter passcode to unlock the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-[#1AB16A]/50 text-white focus:ring-[#1AB16A]"
              />
              {error && <p className="text-sm font-medium text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full bg-[#1AB16A] text-black font-bold hover:bg-[#1AB16A]/80">
                UNLOCK
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-black text-gray-300">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-8">
            <Truck className="h-7 w-7 text-[#1AB16A]" />
            <h1 className="text-xl font-bold text-white">JUNKXPRESS</h1>
        </div>
        <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 text-white bg-[#1AB16A]/20">
                <Inbox className="h-5 w-5" /> Inbox
            </Button>
        </div>
        <div className="mt-auto space-y-4">
          <Card className="bg-[#111] border-gray-800">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">New Today</p>
              <p className="text-2xl font-bold text-white">{todayCount}</p>
            </CardContent>
          </Card>
           <Card className="bg-[#111] border-gray-800">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-white">{unreadCount}</p>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1">
        <div className={cn("w-full md:w-1/3 lg:w-2/5 xl:w-1/3 border-r border-gray-800 flex flex-col", selectedMessage && "hidden md:flex")}>
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-800 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Inbox</h2>
                <Button onClick={fetchMessages} size="icon" variant="ghost" disabled={isSyncing}>
                  <RefreshCw className={cn("h-5 w-5", isSyncing && "animate-spin")} />
                </Button>
              </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input 
                placeholder="Search messages..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-[#111] border-gray-700 pl-10 text-white"
              />
            </div>
          </div>
          
          {/* Message List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-[#1AB16A]" />
                </div>
            ) : (
                filteredMessages.map(message => (
                    <div 
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={cn(
                            "flex justify-between items-start p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900/50",
                            selectedMessage?.id === message.id && "bg-[#1AB16A]/10",
                            !message.isRead && "border-l-4 border-[#1AB16A]"
                        )}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                             {!message.isRead && <div className="h-2 w-2 rounded-full bg-[#1AB16A] flex-shrink-0"></div>}
                             <div className={cn("flex-1 overflow-hidden", message.isRead && "ml-5")}>
                                <p className="font-semibold text-white truncate">{message.name}</p>
                                <p className="text-sm text-gray-400 truncate">{message.email}</p>
                                <p className="text-sm text-gray-500 truncate mt-1">{message.message}</p>
                             </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                           <p className="text-xs text-gray-500">{format(message.createdAt.toDate(), "MMM d")}</p>
                        </div>
                    </div>
                ))
            )}
            {!loading && filteredMessages.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <Inbox className="mx-auto h-12 w-12" />
                    <p>No messages found.</p>
                </div>
            )}
          </div>
        </div>

        <div className={cn("flex-1 flex-col", !selectedMessage && "hidden md:flex")}>
            {selectedMessage ? (
              <div className="flex flex-col h-full">
                {/* Message Detail Header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button onClick={() => setSelectedMessage(null)} size="icon" variant="ghost" className="md:hidden">
                            <ChevronRight className="h-6 w-6 transform rotate-180" />
                        </Button>
                        <div>
                            <h3 className="text-lg font-bold text-white">{selectedMessage.name}</h3>
                            <p className="text-sm text-gray-400">{selectedMessage.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toggleReadStatus(selectedMessage)}>
                           {selectedMessage.isRead ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                                <Trash2 className="h-5 w-5"/>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#111] border-gray-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the message.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMessage(selectedMessage.id)} className="bg-red-600 hover:bg-red-500">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                {/* Message Body */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <p className="text-xs text-gray-500 mb-4">{format(selectedMessage.createdAt.toDate(), "PPP p")}</p>
                    <p className="whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                </div>
              </div>
            ) : (
                <div className="flex h-full items-center justify-center text-center text-gray-600">
                    <div>
                        <Inbox className="mx-auto h-24 w-24" />
                        <p className="mt-4 text-lg">Select a message to read</p>
                        <p>No message selected</p>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

const Truck = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H15" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
    </svg>
);
