
'use client';

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { initializeFirebase } from '@/firebase';
import { 
  collection, getDocs, orderBy, query, Timestamp, doc, updateDoc, deleteDoc, 
  where, getCountFromServer, onSnapshot, addDoc, serverTimestamp, Unsubscribe 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Trash2, Eye, EyeOff, Search, Inbox, ChevronRight, Loader2, RefreshCw, Truck, Briefcase, Users, BarChart2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// --- Data Types ---
type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  isRead: boolean;
};

type Job = {
    id: string;
    clientName: string;
    clientPhone: string;
    address: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    date: string;
    photoURL?: string;
    timestamp: Timestamp;
};

type Customer = {
    name: string;
    email: string;
    phone: string;
};

// --- Main Component ---
export default function AdminDashboardPage() {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // --- Global State ---
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("messages");
  const { toast } = useToast();

  // --- Data State ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // --- Search State ---
  const [searchMessages, setSearchMessages] = useState('');
  const [searchJobs, setSearchJobs] = useState('');
  const [searchCustomers, setSearchCustomers] = useState('');
  
  // --- Derived State (Stats & Memoized Filters) ---
  const unreadCount = useMemo(() => messages.filter(m => !m.isRead).length, [messages]);
  const stats = useMemo(() => {
    return {
      totalJobs: jobs.length,
      completedJobs: jobs.filter(j => j.status === 'Completed').length,
      pendingJobs: jobs.filter(j => j.status === 'Pending').length,
    };
  }, [jobs]);

  const filteredMessages = useMemo(() => messages.filter(m => 
    m.name.toLowerCase().includes(searchMessages.toLowerCase()) || 
    m.email.toLowerCase().includes(searchMessages.toLowerCase()) || 
    m.message.toLowerCase().includes(searchMessages.toLowerCase())
  ), [messages, searchMessages]);

  const filteredJobs = useMemo(() => jobs.filter(j => 
    j.clientName.toLowerCase().includes(searchJobs.toLowerCase()) || 
    j.address.toLowerCase().includes(searchJobs.toLowerCase())
  ), [jobs, searchJobs]);

  const filteredCustomers = useMemo(() => customers.filter(c =>
    c.name.toLowerCase().includes(searchCustomers.toLowerCase()) ||
    c.email.toLowerCase().includes(searchCustomers.toLowerCase())
  ), [customers, searchCustomers]);

  // --- Effects ---
  useEffect(() => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    const { firestore } = initializeFirebase();
    const unsubscribes: Unsubscribe[] = [];

    // Messages listener
    const messagesQuery = query(collection(firestore, 'messages'), orderBy('createdAt', 'desc'));
    unsubscribes.push(onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(fetchedMessages);
    }, (error) => {
        console.error("Error fetching messages:", error);
        toast({ title: "Error", description: "Failed to load messages.", variant: "destructive" });
    }));

    // Jobs listener
    const jobsQuery = query(collection(firestore, 'jobs'), orderBy('timestamp', 'desc'));
    unsubscribes.push(onSnapshot(jobsQuery, (snapshot) => {
      const fetchedJobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[];
      setJobs(fetchedJobs);
    }, (error) => {
        console.error("Error fetching jobs:", error);
        toast({ title: "Error", description: "Failed to load jobs.", variant: "destructive" });
    }));

    // Customers listener (derived from messages)
    const customersQuery = query(collection(firestore, 'messages'));
    unsubscribes.push(onSnapshot(customersQuery, (snapshot) => {
        const customerMap: { [email: string]: Customer } = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.email) {
                customerMap[data.email] = { name: data.name, email: data.email, phone: data.phone || 'N/A' };
            }
        });
        setCustomers(Object.values(customerMap));
    }, (error) => {
        console.error("Error fetching customers:", error);
        toast({ title: "Error", description: "Failed to load customers.", variant: "destructive" });
    }));

    setLoading(false);

    // Cleanup function
    return () => unsubscribes.forEach(unsub => unsub());

  }, [isAuthenticated, toast]);


  // --- Event Handlers ---
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password.');
    }
    setPassword('');
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({ title: "No Data", description: "There is nothing to export."});
      return;
    }
    const headers = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'timestamp' && k !== 'photoURL' && k !== 'isRead').join(',');
    const rows = data.map(row => 
      Object.keys(row)
        .filter(k => k !== 'id' && k !== 'timestamp' && k !== 'photoURL' && k !== 'isRead')
        .map(key => `"${(row[key]?.toString() || '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: `${filename} has been downloaded.` });
  };
  

  // --- Auth Gate ---
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black p-4">
        <Card className="w-full max-w-md bg-[#111] border-[#1AB16A]/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-[#1AB16A]">ADMIN ACCESS</CardTitle>
            <CardDescription className="text-center text-gray-400">Enter passcode to unlock the dashboard.</CardDescription>
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
              {authError && <p className="text-sm font-medium text-red-500 text-center">{authError}</p>}
              <Button type="submit" className="w-full bg-[#1AB16A] text-black font-bold hover:bg-[#1AB16A]/80">UNLOCK</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Render Dashboard ---
  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-gray-300">
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-[#1AB16A]" />
            <h1 className="text-xl font-bold text-white">JUNKXPRESS ADMIN</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className='text-right'>
                <p className="text-sm font-semibold text-white">Admin</p>
                <p className="text-xs text-gray-400">Dashboard</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)}>Logout</Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#111]">
            <TabsTrigger value="messages" className="gap-2"><Inbox className="h-4 w-4" />Messages</TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2"><Briefcase className="h-4 w-4"/>Jobs</TabsTrigger>
            <TabsTrigger value="customers" className="gap-2"><Users className="h-4 w-4"/>Customers</TabsTrigger>
            <TabsTrigger value="stats" className="gap-2"><BarChart2 className="h-4 w-4"/>Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="mt-6">
            <MessagesTab messages={filteredMessages} setSearchTerm={setSearchMessages} onExport={() => exportToCSV(messages, 'messages.csv')} />
          </TabsContent>
          
          <TabsContent value="jobs" className="mt-6">
            <JobsTab jobs={filteredJobs} setSearchTerm={setSearchJobs} onExport={() => exportToCSV(jobs, 'jobs.csv')} />
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
             <CustomersTab customers={filteredCustomers} setSearchTerm={setSearchCustomers} onExport={() => exportToCSV(customers, 'customers.csv')} />
          </TabsContent>

           <TabsContent value="stats" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Site Statistics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border bg-card p-6 text-center">
                        <p className="text-sm text-muted-foreground">Total Jobs</p>
                        <p className="text-4xl font-bold">{stats.totalJobs}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-6 text-center">
                        <p className="text-sm text-muted-foreground">Completed Jobs</p>
                        <p className="text-4xl font-bold text-green-500">{stats.completedJobs}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-6 text-center">
                        <p className="text-sm text-muted-foreground">Pending Jobs</p>
                        <p className="text-4xl font-bold text-yellow-500">{stats.pendingJobs}</p>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// --- Messages Tab Component ---
function MessagesTab({ messages, setSearchTerm, onExport }: { messages: Message[], setSearchTerm: (s:string)=>void, onExport:()=>void }) {
    const { toast } = useToast();

    const toggleReadStatus = async (message: Message) => {
        const { firestore } = initializeFirebase();
        const messageRef = doc(firestore, 'messages', message.id);
        try {
            await updateDoc(messageRef, { isRead: !message.isRead });
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
            toast({ title: "Success", description: "Message deleted successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Could not delete message.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Form Messages</CardTitle>
                <div className="flex gap-4 mt-4">
                    <Input placeholder="Search messages..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button onClick={onExport} variant="outline">Export CSV</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {messages.length > 0 ? messages.map(msg => (
                        <Card key={msg.id} className={cn(msg.isRead && "opacity-60", "border-l-4 border-primary")}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{msg.name}</CardTitle>
                                        <CardDescription>{msg.email}</CardDescription>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{format(msg.createdAt.toDate(), "PPp")}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">{msg.message}</p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => toggleReadStatus(msg)}>
                                        {msg.isRead ? <Eye className="mr-2 h-4 w-4"/> : <EyeOff className="mr-2 h-4 w-4"/>}
                                        Mark as {msg.isRead ? 'Unread' : 'Read'}
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the message.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteMessage(msg.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    )) : <p>No messages found.</p>}
                </div>
            </CardContent>
        </Card>
    );
}

// --- Jobs Tab Component ---
function JobsTab({ jobs, setSearchTerm, onExport }: { jobs: Job[], setSearchTerm: (s:string)=>void, onExport:()=>void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleAddJob = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const { firestore, storage } = initializeFirebase();

        const jobData = {
            clientName: formData.get('clientName') as string,
            clientPhone: formData.get('clientPhone') as string,
            address: formData.get('address') as string,
            status: formData.get('status') as Job['status'],
            date: formData.get('date') as string,
            timestamp: serverTimestamp(),
            photoURL: ''
        };

        try {
            if (photoFile) {
                const storageRef = ref(storage, `jobPhotos/${Date.now()}_${photoFile.name}`);
                const snapshot = await uploadBytes(storageRef, photoFile);
                jobData.photoURL = await getDownloadURL(snapshot.ref);
            }
            await addDoc(collection(firestore, 'jobs'), jobData);
            toast({ title: "Success", description: "New job added." });
            formRef.current?.reset();
            setPhotoFile(null);
        } catch (error) {
            console.error("Error adding job:", error);
            toast({ title: "Error", description: "Failed to add job.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteJob = async (id: string) => {
        const { firestore } = initializeFirebase();
        try {
            await deleteDoc(doc(firestore, 'jobs', id));
            toast({ title: "Success", description: "Job deleted." });
        } catch (error) {
            toast({ title: "Error", description: "Could not delete job.", variant: "destructive" });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Job</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form ref={formRef} onSubmit={handleAddJob} className="space-y-4">
                            <Input name="clientName" placeholder="Client Name" required />
                            <Input name="clientPhone" placeholder="Client Phone" required />
                            <Textarea name="address" placeholder="Job Address" required />
                            <Select name="status" defaultValue="Pending" required>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input name="date" type="date" required />
                            <Input name="photo" type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setPhotoFile(e.target.files?.[0] || null)}/>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Job
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Jobs</CardTitle>
                        <div className="flex gap-4 mt-4">
                            <Input placeholder="Search jobs..." onChange={e => setSearchTerm(e.target.value)} />
                            <Button onClick={onExport} variant="outline">Export CSV</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                           {jobs.length > 0 ? jobs.map(job => (
                                <Card key={job.id}>
                                    <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                        <div className="sm:col-span-2 space-y-1">
                                            <p><strong>Client:</strong> {job.clientName}</p>
                                            <p><strong>Address:</strong> {job.address}</p>
                                            <p><strong>Date:</strong> {job.date}</p>
                                            <p><strong>Status:</strong> <span className={cn(
                                                job.status === 'Completed' && 'text-green-500',
                                                job.status === 'Pending' && 'text-yellow-500',
                                                job.status === 'In Progress' && 'text-blue-500'
                                            )}>{job.status}</span></p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            {job.photoURL && <img src={job.photoURL} alt="Job" className="w-24 h-24 object-cover rounded-md" />}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive" className="w-full"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the job.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteJob(job.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : <p>No jobs found.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- Customers Tab Component ---
function CustomersTab({ customers, setSearchTerm, onExport }: { customers: Customer[], setSearchTerm: (s:string)=>void, onExport:()=>void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
        <div className="flex gap-4 mt-4">
            <Input placeholder="Search customers..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button onClick={onExport} variant="outline">Export CSV</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.length > 0 ? customers.map(cust => (
            <Card key={cust.email}>
              <CardContent className="p-4 space-y-1">
                <p><strong>Name:</strong> {cust.name}</p>
                <p><strong>Email:</strong> {cust.email}</p>
                <p><strong>Phone:</strong> {cust.phone}</p>
              </CardContent>
            </Card>
          )) : <p>No customers found.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
