
'use client';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
  timestamp: number, 
};

type Message = { id: string, name: string, email: string, phone: string, message: string, timestamp: number, read: boolean };
type Customer = { email: string, name: string, phone: string };

// Helper to get data from localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const item = window.localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Helper to set data to localStorage
const setInStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};


export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if(password==='Cmc0536$@!') setIsAuthenticated(true);
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

  // Function to re-read all data from localStorage and update state
  const refreshData = () => {
    setMessages(getFromStorage('messages', []));
    setJobs(getFromStorage('jobs', []));
    setCompletedJobs(getFromStorage('completedJobs', []));
  }

  // Load initial data and set up a listener for storage changes
  useEffect(() => {
    refreshData();

    const handleStorageChange = () => {
        refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event listener for when this app itself changes storage
    window.addEventListener('local-storage-changed', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('local-storage-changed', handleStorageChange);
    };
  }, []);
  
  const customers = useMemo<Customer[]>(() => {
    const customerMap = new Map<string, Customer>();
    [...messages, ...jobs, ...completedJobs].forEach(item => {
        const email = item.email;
        // Adjust for different property names in Job vs Message
        const name = 'clientName' in item ? item.clientName : item.name;
        const phone = 'clientPhone' in item ? item.clientPhone : item.phone;
        if (email && !customerMap.has(email)) {
            customerMap.set(email, { name, email, phone });
        }
    });
    return Array.from(customerMap.values());
  }, [messages, jobs, completedJobs]);

  const allJobs = useMemo(() => [...jobs, ...completedJobs], [jobs, completedJobs]);

  const triggerStorageUpdate = () => {
      window.dispatchEvent(new Event('local-storage-changed'));
  }

  const handleCompleteJob = (jobToComplete: Job) => {
    const newCompletedJobs = [jobToComplete, ...getFromStorage('completedJobs', [])];
    setInStorage('completedJobs', newCompletedJobs);
    
    const newJobs = getFromStorage('jobs', []).filter((j: Job) => j.id !== jobToComplete.id);
    setInStorage('jobs', newJobs);

    triggerStorageUpdate();
  };

  const handleDeleteJob = (jobId: string) => {
    const newJobs = getFromStorage('jobs', []).filter((j: Job) => j.id !== jobId);
    setInStorage('jobs', newJobs);
    triggerStorageUpdate();
  };
  
  const handleDeleteCompletedJob = (jobId: string) => {
    const newCompletedJobs = getFromStorage('completedJobs', []).filter((j: Job) => j.id !== jobId);
    setInStorage('completedJobs', newCompletedJobs);
    triggerStorageUpdate();
  };

  const handleSendMessage = (job: Job) => {
    const newMessage = {
        id: `msg-${Date.now()}`,
        name: job.clientName,
        email: job.email,
        phone: job.clientPhone,
        message: `Follow-up regarding your service for ${job.serviceType} at ${job.address} scheduled for ${job.date}.`,
        timestamp: Date.now(),
        read: false
    };

    const newMessages = [newMessage, ...getFromStorage('messages', [])];
    setInStorage('messages', newMessages);

    alert(`Message prepared for ${job.clientName}. Check the messages tab.`);
    setActiveSection('messages');
    triggerStorageUpdate();
  };

  const handleDeleteMessage = (messageId: string) => {
    const newMessages = getFromStorage('messages', []).filter((m: Message) => m.id !== messageId);
    setInStorage('messages', newMessages);
    triggerStorageUpdate();
  }


  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <header className="bg-card border-b p-4 text-primary-foreground font-bold text-2xl text-center mb-4">
        <h1 className="font-headline text-2xl text-center font-bold text-foreground">Capital CleanOuts Dashboard</h1>
      </header>
      <nav className="flex flex-wrap gap-2 justify-center mb-4">
        <Button variant={activeSection === 'jobs' ? 'default' : 'outline'} onClick={()=>setActiveSection('jobs')}>Cleaning Jobs ({jobs.length})</Button>
        <Button variant={activeSection === 'messages' ? 'default' : 'outline'} onClick={()=>setActiveSection('messages')}>Messages ({messages.length})</Button>
        <Button variant={activeSection === 'customers' ? 'default' : 'outline'} onClick={()=>setActiveSection('customers')}>Customers ({customers.length})</Button>
        <Button variant={activeSection === 'stats' ? 'default' : 'outline'} onClick={()=>setActiveSection('stats')}>Job Overview</Button>
      </nav>

      <main>
        {activeSection==='messages' && <MessagesSection messages={messages} onDelete={handleDeleteMessage} />}
        {activeSection==='jobs' && <JobsSection jobs={jobs} onComplete={handleCompleteJob} onDelete={handleDeleteJob} onSendMessage={handleSendMessage} />}
        {activeSection==='customers' && <CustomersSection customers={customers} />}
        {activeSection==='stats' && <StatsSection allJobs={allJobs} completedJobs={completedJobs} onDeleteCompleted={handleDeleteCompletedJob} />}
      </main>
    </div>
  );
}

function MessagesSection({messages, onDelete}:{messages:Message[], onDelete: (id: string) => void}){

  const getDisplayDate = (timestamp: number) => {
    if (!timestamp) return 'No date';
    return new Date(timestamp).toLocaleString();
  }

  const sortedMessages = [...messages].sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-center">Messages ({messages.length})</h2>
      {sortedMessages.length === 0 && <p className='text-center text-muted-foreground'>No messages yet.</p>}
      {sortedMessages.map(m=>(
        <Card key={m.id} className="mb-2 max-w-2xl mx-auto">
          <CardContent className="p-3 text-sm space-y-1">
            <p><strong>Name:</strong> {m.name}</p>
            <p><strong>Email:</strong> {m.email}</p>
            <p><strong>Phone:</strong> {m.phone}</p>
            <p><strong>Message:</strong> {m.message}</p>
            <p className="text-xs text-muted-foreground"><strong>Received:</strong> {getDisplayDate(m.timestamp)}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="destructive" onClick={()=>onDelete(m.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function JobsSection({ jobs, onComplete, onDelete, onSendMessage }: { jobs: Job[], onComplete: (job: Job) => void, onDelete: (id: string) => void, onSendMessage: (job: Job) => void }) {
  const sortedJobs = [...jobs].sort((a,b) => b.timestamp - a.timestamp);
  return (
    <div>
       <div className="flex justify-center items-center mb-2">
        <h2 className="text-xl font-bold">Active Cleaning Jobs ({jobs.length})</h2>
      </div>
      {sortedJobs.length === 0 && <p className='text-center text-muted-foreground'>No active jobs.</p>}
      {sortedJobs.map(j=>(
        <Card key={j.id} className="mb-2 max-w-3xl mx-auto">
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p><strong>Client:</strong> {j.clientName} ({j.clientPhone})</p>
                <p><strong>Address:</strong> {j.address}</p>
                <p><strong>Email:</strong> {j.email}</p>
              </div>
              <div className="text-right">
                <p><strong>Status:</strong> <span className='font-semibold text-primary'>{j.status}</span></p>
                <p><strong>Requested Date:</strong> {j.date}</p>
              </div>
            </div>
            <div className='bg-muted/50 p-3 rounded-md mt-2'>
              <p><strong>Job:</strong> {j.serviceType} ({j.propertyType})</p>
              <p><strong>Size:</strong> {j.bedrooms} Bed, {j.bathrooms} Bath</p>
              {j.notes && <p><strong>Notes:</strong> {j.notes}</p>}
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => onComplete(j)}>Complete Job</Button>
              <Button size="sm" variant="secondary" onClick={() => onSendMessage(j)}>Prepare Message</Button>
              <Button size="sm" variant="destructive" onClick={()=>onDelete(j.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CustomersSection({ customers }: { customers: Customer[] }) {
    const sortedCustomers = [...customers].sort((a,b) => a.name.localeCompare(b.name));
    return (
        <div>
            <h2 className="text-xl font-bold mb-2 text-center">Customers ({customers.length})</h2>
            {sortedCustomers.length === 0 && <p className='text-center text-muted-foreground'>No customers yet.</p>}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-w-5xl mx-auto'>
                {sortedCustomers.map(cust => (
                    <Card key={cust.email} className="mb-2">
                        <CardContent className="p-3 text-sm space-y-1">
                            <p><strong>Name:</strong> {cust.name}</p>
                            <p><strong>Email:</strong> {cust.email}</p>
                            <p><strong>Phone:</strong> {cust.phone}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function StatsSection({ allJobs, completedJobs, onDeleteCompleted }: { allJobs: Job[], completedJobs: Job[], onDeleteCompleted: (id: string) => void }) {
    const totalJobs = allJobs.length;
    const pendingJobs = allJobs.filter(j => j.status === 'Pending').length;
    const scheduledJobs = allJobs.filter(j => j.status === 'Scheduled').length;
    
    const sortedCompleted = [...completedJobs].sort((a,b) => b.timestamp - a.timestamp);

    const StatCard = ({ title, value }: { title: string, value: number | string }) => (
        <div className="flex-1 bg-card p-4 rounded-xl text-center border">
            <p className="text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
    
    const getDisplayDate = (timestamp: number) => {
        if (!timestamp) return 'No date';
        return new Date(timestamp).toLocaleString();
    }

    return (
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Job Overview</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-4xl mx-auto">
            <StatCard title="Total Jobs Created" value={totalJobs} />
            <StatCard title="Completed" value={completedJobs.length} />
            <StatCard title="Pending" value={pendingJobs} />
            <StatCard title="Scheduled" value={scheduledJobs} />
        </div>

        <h3 className="text-lg font-bold mt-6 mb-2 text-center">Completed Jobs History</h3>
        {sortedCompleted.length === 0 && <p className='text-center text-muted-foreground'>No completed jobs yet.</p>}
        {sortedCompleted.map(j=>(
        <Card key={j.id} className="mb-2 max-w-3xl mx-auto">
          <CardContent className="p-4 space-y-2 text-sm">
             <div className="flex justify-between items-start">
              <div>
                <p><strong>Client:</strong> {j.clientName} ({j.clientPhone})</p>
                <p><strong>Address:</strong> {j.address}</p>
              </div>
              <div className="text-right">
                <p><strong>Status:</strong> <span className='font-semibold text-green-600'>{j.status}</span></p>
                <p><strong>Completed On:</strong> {getDisplayDate(j.timestamp)}</p>
              </div>
            </div>
            <div className='bg-muted/50 p-3 rounded-md mt-2'>
              <p><strong>Job:</strong> {j.serviceType} ({j.propertyType})</p>
              <p><strong>Size:</strong> {j.bedrooms} Bed, {j.bathrooms} Bath</p>
            </div>
             <div className="flex gap-2 mt-2">
                <Button size="sm" variant="destructive" onClick={()=>onDeleteCompleted(j.id)}>Delete from History</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    );
}

    