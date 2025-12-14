
'use client';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { initializeFirebase } from '@/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, orderBy, query, getDoc, Timestamp, addDoc } from 'firebase/firestore';

type Job = { 
  id: string, 
  clientName: string, 
  clientPhone: string, 
  email: string,
  address: string, 
  serviceType: string,
  propertyType: string,
  bedrooms: string,
  bathrooms: string,
  notes: string,
  status: 'Pending' | 'Scheduled' | 'Completed', 
  date: string, 
  timestamp: Timestamp, 
};

type Message = { id: string, name: string, email: string, phone: string, message: string, timestamp: Timestamp, read: boolean };
type Customer = { email: string, name: string, phone: string };

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if(password==='1234') setIsAuthenticated(true);
    else {
      alert('Incorrect Password');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if(!isAuthenticated){
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm text-center">
          <h1 className="font-headline text-3xl font-bold text-primary">Admin Dashboard</h1>
          <Input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Password" 
            className="text-center text-lg"
          />
          <Button onClick={handleLogin} className="mt-4 w-full">Enter</Button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard(){
  const [activeSection, setActiveSection] = useState<'messages'|'jobs'|'customers'|'stats'>('jobs');
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const { firestore } = initializeFirebase();

  // Listen for jobs
  useEffect(() => {
    if (!firestore) return;
    const jobsCol = collection(firestore, "jobs");
    const q = query(jobsCol, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      setJobs(jobsData);
    }, (error) => {
      console.error("Error fetching jobs: ", error);
    });
    return () => unsubscribe();
  }, [firestore]);

  // Listen for completed jobs
  useEffect(() => {
    if (!firestore) return;
    const completedCol = collection(firestore, "completedJobs");
    const q = query(completedCol, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const completedJobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      setCompletedJobs(completedJobsData);
    }, (error) => {
      console.error("Error fetching completed jobs: ", error);
    });
    return () => unsubscribe();
  }, [firestore]);

  // Listen for messages
  useEffect(() => {
    if (!firestore) return;
    const messagesCol = collection(firestore, "messages");
    const q = query(messagesCol, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(messagesData);
    }, (error) => {
      console.error("Error fetching messages: ", error);
    });
    return () => unsubscribe();
  }, [firestore]);


  const customers = useMemo<Customer[]>(() => {
    const customerMap = new Map<string, Customer>();
    messages.forEach(m => {
      if (m.email && !customerMap.has(m.email)) {
        customerMap.set(m.email, { name: m.name, email: m.email, phone: m.phone });
      }
    });
    jobs.forEach(j => {
        if(j.email && !customerMap.has(j.email)) {
            customerMap.set(j.email, {name: j.clientName, email: j.email, phone: j.clientPhone});
        }
    })
    completedJobs.forEach(j => {
        if(j.email && !customerMap.has(j.email)) {
            customerMap.set(j.email, {name: j.clientName, email: j.email, phone: j.clientPhone});
        }
    })
    return Array.from(customerMap.values());
  }, [messages, jobs, completedJobs]);

  const allJobs = useMemo(() => [...jobs, ...completedJobs], [jobs, completedJobs]);


  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <header className="bg-card border-b p-4 text-primary-foreground font-bold text-2xl text-center mb-4">
        <h1 className="font-headline text-2xl text-center font-bold text-foreground">Capital CleanOuts Dashboard</h1>
      </header>
      <nav className="flex flex-wrap gap-2 justify-center mb-4">
        <Button variant={activeSection === 'jobs' ? 'default' : 'outline'} onClick={()=>setActiveSection('jobs')}>Cleaning Jobs ({jobs.length})</Button>
        <Button variant={activeSection === 'messages' ? 'default' : 'outline'} onClick={()=>setActiveSection('messages')}>Messages ({messages.filter(m => !m.read).length})</Button>
        <Button variant={activeSection === 'customers' ? 'default' : 'outline'} onClick={()=>setActiveSection('customers')}>Customers ({customers.length})</Button>
        <Button variant={activeSection === 'stats' ? 'default' : 'outline'} onClick={()=>setActiveSection('stats')}>Job Overview</Button>
      </nav>

      <main>
        {activeSection==='messages' && <MessagesSection messages={messages} />}
        {activeSection==='jobs' && <JobsSection jobs={jobs} />}
        {activeSection==='customers' && <CustomersSection customers={customers} />}
        {activeSection==='stats' && <StatsSection allJobs={allJobs} completedJobs={completedJobs} />}
      </main>
    </div>
  );
}

function MessagesSection({messages}:{messages:Message[]}){
  const { firestore } = initializeFirebase();

  const deleteMsg = async (id:string) => {
    if(!firestore) return;
    await deleteDoc(doc(firestore, "messages", id));
  };

  const getDisplayDate = (timestamp: Timestamp | number) => {
    if (!timestamp) return 'No date';
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Messages</h2>
      {messages.map(m=>(
        <Card key={m.id} className="mb-2">
          <CardContent className="p-3 text-sm space-y-1">
            <p><strong>Name:</strong> {m.name}</p>
            <p><strong>Email:</strong> {m.email}</p>
            <p><strong>Phone:</strong> {m.phone}</p>
            <p><strong>Message:</strong> {m.message}</p>
            <p className="text-xs text-muted-foreground"><strong>Date:</strong> {getDisplayDate(m.timestamp)}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="destructive" onClick={()=>deleteMsg(m.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function JobsSection({ jobs }: { jobs: Job[] }) {
    const { firestore } = initializeFirebase();

    const deleteJob = async (id: string) => {
        if (!firestore) return;
        await deleteDoc(doc(firestore, "jobs", id));
    };

    const completeJob = async (job: Job) => {
        if (!firestore) return;
        const { id, ...jobData } = job;
        const completedJobData = { ...jobData, status: 'Completed' as const, timestamp: Timestamp.now() };
        await setDoc(doc(firestore, "completedJobs", id), completedJobData);
        await deleteDoc(doc(firestore, "jobs", id));
    };

    const sendMessage = async (job: Job) => {
        if (!firestore) return;
        const messageData = {
            name: job.clientName,
            email: job.email,
            phone: job.clientPhone,
            message: `Regarding your cleaning service for ${job.serviceType} at ${job.address} scheduled for ${job.date}.`,
            timestamp: Timestamp.now(),
            read: false
        };
        
        await addDoc(collection(firestore, "messages"), messageData);
        alert(`Message created for ${job.clientName}. Check the messages tab.`);
    };


  return (
    <div>
       <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Active Cleaning Jobs ({jobs.length})</h2>
      </div>
      {jobs.map(j=>(
        <Card key={j.id} className="mb-2">
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p><strong>Client:</strong> {j.clientName} ({j.clientPhone})</p>
                <p><strong>Address:</strong> {j.address}</p>
                <p><strong>Email:</strong> {j.email}</p>
              </div>
              <div className="text-right">
                <p><strong>Status:</strong> {j.status}</p>
                <p><strong>Date:</strong> {j.date}</p>
              </div>
            </div>
            <div className='bg-muted/50 p-3 rounded-md mt-2'>
              <p><strong>Job:</strong> {j.serviceType} ({j.propertyType})</p>
              <p><strong>Size:</strong> {j.bedrooms} Bed, {j.bathrooms} Bath</p>
              {j.notes && <p><strong>Notes:</strong> {j.notes}</p>}
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="complete" onClick={() => completeJob(j)}>Complete</Button>
              <Button size="sm" className="send" onClick={() => sendMessage(j)}>Send Message</Button>
              <Button size="sm" variant="destructive" onClick={()=>deleteJob(j.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CustomersSection({ customers }: { customers: Customer[] }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Customers</h2>
            {customers.map(cust => (
                <Card key={cust.email} className="mb-2">
                    <CardContent className="p-3 text-sm space-y-1">
                        <p><strong>Name:</strong> {cust.name}</p>
                        <p><strong>Email:</strong> {cust.email}</p>
                        <p><strong>Phone:</strong> {cust.phone}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function StatsSection({ allJobs, completedJobs }: { allJobs: Job[], completedJobs: Job[]}) {
    const totalJobs = allJobs.length;
    const pendingJobs = allJobs.filter(j => j.status === 'Pending').length;
    const scheduledJobs = allJobs.filter(j => j.status === 'Scheduled').length;

    const StatCard = ({ title, value }: { title: string, value: number | string }) => (
        <div className="flex-1 bg-card p-4 rounded-xl text-center border">
            <span className="text-xl font-bold">{title}</span>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
    
    const getDisplayDate = (timestamp: Timestamp | number) => {
        if (!timestamp) return 'No date';
        if (timestamp instanceof Timestamp) {
          return timestamp.toDate().toLocaleString();
        }
        return new Date(timestamp).toLocaleString();
    }

    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Job Overview</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <StatCard title="Total Jobs Today" value={totalJobs} />
            <StatCard title="Completed Jobs" value={completedJobs.length} />
            <StatCard title="Pending" value={pendingJobs} />
            <StatCard title="Scheduled" value={scheduledJobs} />
        </div>

        <h3 className="text-lg font-bold mt-6 mb-2">Completed Jobs Details</h3>
        {completedJobs.map(j=>(
        <Card key={j.id} className="mb-2">
          <CardContent className="p-4 space-y-2 text-sm">
             <div className="flex justify-between items-start">
              <div>
                <p><strong>Client:</strong> {j.clientName} ({j.clientPhone})</p>
                <p><strong>Address:</strong> {j.address}</p>
              </div>
              <div className="text-right">
                <p><strong>Status:</strong> {j.status}</p>
                <p><strong>Date:</strong> {getDisplayDate(j.timestamp)}</p>
              </div>
            </div>
            <div className='bg-muted/50 p-3 rounded-md mt-2'>
              <p><strong>Job:</strong> {j.serviceType} ({j.propertyType})</p>
              <p><strong>Size:</strong> {j.bedrooms} Bed, {j.bathrooms} Bath</p>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    );
}

    