
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: number;
  read: boolean;
};

type Job = {
  id: string;
  clientName: string;
  clientPhone: string;
  address: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  date: string;
  photo?: string; // Base64 encoded string
  timestamp: number;
};

type Customer = {
  email: string;
  name: string;
  phone: string;
};

type Section = 'messages' | 'jobs' | 'customers' | 'stats';

// Main Dashboard Component
export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg text-center">
          <h1 className="mb-6 font-headline text-3xl font-bold text-primary">
            Admin Dashboard
          </h1>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Password"
              className="bg-input text-center text-lg"
            />
            <Button onClick={handleLogin} className="w-full" variant="neon-green">
              Enter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}


function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    setMessages(JSON.parse(localStorage.getItem('messages') || '[]'));
    setJobs(JSON.parse(localStorage.getItem('jobs') || '[]'));
  }, []);

  // Persist data to localStorage on change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Auto-refresh dashboard if storage changes (from other pages)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
        if (event.key === 'messages') {
            setMessages(JSON.parse(localStorage.getItem('messages') || '[]'));
        }
        if (event.key === 'jobs') {
            setJobs(JSON.parse(localStorage.getItem('jobs') || '[]'));
        }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const customers = useMemo<Customer[]>(() => {
    const customerMap = new Map<string, Customer>();
    messages.forEach(m => {
      if (m.email && !customerMap.has(m.email)) {
        customerMap.set(m.email, { name: m.name, email: m.email, phone: m.phone });
      }
    });
    return Array.from(customerMap.values());
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="bg-[#1AB16A] p-4 text-center text-2xl font-bold text-black">
        JUNKXPRESS Admin Dashboard
      </header>
      <nav className="flex justify-center gap-4 bg-[#151515] p-3">
        <Button variant="neon-green" onClick={() => setActiveSection('messages')}>Messages</Button>
        <Button variant="neon-green" onClick={() => setActiveSection('jobs')}>Jobs</Button>
        <Button variant="neon-green" onClick={() => setActiveSection('customers')}>Customers</Button>
        <Button variant="neon-green" onClick={() => setActiveSection('stats')}>Stats</Button>
      </nav>
      <main className="p-4">
        {activeSection === 'messages' && <MessagesSection messages={messages} setMessages={setMessages} />}
        {activeSection === 'jobs' && <JobsSection jobs={jobs} setJobs={setJobs} />}
        {activeSection === 'customers' && <CustomersSection customers={customers} />}
        {activeSection === 'stats' && <StatsSection jobs={jobs} />}
      </main>
    </div>
  );
}

// Stats Section
function StatsSection({ jobs }: { jobs: Job[] }) {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'Completed').length;
    const pendingJobs = jobs.filter(j => j.status === 'Pending').length;

    const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: number | string }) => (
        <div className="flex-1 bg-[#151515] p-4 rounded-lg text-center border-l-4 border-[#1AB16A] flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-xl font-bold">{title}</span>
            </div>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );

    return (
      <>
        <h2 className="text-2xl font-bold mb-4">Dashboard Stats</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <StatCard icon={<Briefcase />} title="Total Jobs" value={totalJobs} />
            <StatCard icon={<Users />} title="Completed Jobs" value={completedJobs} />
            <StatCard icon={<MessageSquare />} title="Pending Jobs" value={pendingJobs} />
        </div>
      </>
    );
}

// Messages Section
function MessagesSection({ messages, setMessages }: { messages: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>> }) {
  const [searchTerm, setSearchTerm] = useState('');

  const addMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      timestamp: Date.now(),
      read: false,
    };
    setMessages(prev => [newMsg, ...prev]);
    form.reset();
  };
  
  const toggleRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, read: !m.read } : m));
  }
  
  const deleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(m => m.id !== id));
    }
  }

  const exportCSV = () => {
    let csv = 'Name,Email,Phone,Message,Date\n';
    filteredMessages.forEach(m => {
        const message = m.message.replace(/,/g, '');
        csv += `${m.name},${m.email},${m.phone},"${message}",${new Date(m.timestamp).toLocaleString()}\n`
    });
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'messages.csv';
    a.click();
  }

  const filteredMessages = messages.filter(m => 
    JSON.stringify(m).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
       <div className="flex gap-4 mb-4">
        <Input 
            id="searchMessages"
            placeholder="Search messages..."
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-[#151515] border-none"
        />
        <Button onClick={exportCSV} variant="neon-green">Export CSV</Button>
      </div>

      <div id="messagesList" className="space-y-4">
        {filteredMessages.map(msg => (
          <Card key={msg.id} className={cn("bg-[#151515] border-l-4 border-[#1AB16A]", msg.read && "opacity-60 border-gray-500")}>
            <CardContent className="p-4 space-y-2 text-sm">
                <p><strong>Name:</strong> {msg.name}</p>
                <p><strong>Email:</strong> {msg.email}</p>
                <p><strong>Phone:</strong> {msg.phone}</p>
                <p><strong>Message:</strong> {msg.message}</p>
                <p><strong>Date:</strong> {new Date(msg.timestamp).toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => toggleRead(msg.id)}>{msg.read ? 'Mark as Unread' : 'Mark as Read'}</Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMessage(msg.id)}>Delete</Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Add New Message</h3>
      <form onSubmit={addMessage} className="space-y-4 bg-[#151515] p-4 rounded-lg">
        <Input name="name" placeholder="Name" required className="bg-[#0f0f0f] border-none" />
        <Input name="email" type="email" placeholder="Email" required className="bg-[#0f0f0f] border-none" />
        <Input name="phone" placeholder="Phone" required className="bg-[#0f0f0f] border-none" />
        <Textarea name="message" placeholder="Message" required className="bg-[#0f0f0f] border-none" />
        <Button type="submit" variant="neon-green">Add Message</Button>
      </form>
    </div>
  );
}

// Jobs Section
function JobsSection({ jobs, setJobs }: { jobs: Job[], setJobs: React.Dispatch<React.SetStateAction<Job[]>> }) {
  const [searchTerm, setSearchTerm] = useState('');

  const addJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem('jobPhoto') as HTMLInputElement).files?.[0];

    const createJob = (photo?: string) => {
        const newJob: Job = {
            id: `job_${Date.now()}`,
            clientName: (form.elements.namedItem('clientName') as HTMLInputElement).value,
            clientPhone: (form.elements.namedItem('clientPhone') as HTMLInputElement).value,
            address: (form.elements.namedItem('address') as HTMLInputElement).value,
            status: (form.elements.namedItem('status') as HTMLSelectElement).value as Job['status'],
            date: (form.elements.namedItem('date') as HTMLInputElement).value,
            timestamp: Date.now(),
            photo: photo,
        };
        setJobs(prev => [newJob, ...prev]);
        form.reset();
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = () => createJob(reader.result as string);
        reader.readAsDataURL(file);
    } else {
        createJob();
    }
  };

  const deleteJob = (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
        setJobs(jobs.filter(j => j.id !== id));
    }
  };
  
  const exportCSV = () => {
    let csv = 'Client,Phone,Address,Status,Date\n';
    filteredJobs.forEach(j => csv += `${j.clientName},${j.clientPhone},${j.address},${j.status},${j.date}\n`);
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'jobs.csv';
    a.click();
  }

  const filteredJobs = jobs.filter(j =>
    JSON.stringify(j).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Jobs</h2>
      <form onSubmit={addJob} className="space-y-4 bg-[#151515] p-4 rounded-lg mb-4">
        <div className="grid md:grid-cols-2 gap-4">
            <Input name="clientName" placeholder="Client Name" required className="bg-[#0f0f0f] border-none" />
            <Input name="clientPhone" placeholder="Client Phone" required className="bg-[#0f0f0f] border-none" />
        </div>
        <Input name="address" placeholder="Job Address" required className="bg-[#0f0f0f] border-none" />
        <div className="grid md:grid-cols-2 gap-4">
            <Select name="status" defaultValue="Pending">
                <SelectTrigger className="bg-[#0f0f0f] border-none">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
            </Select>
            <Input name="date" type="date" required className="bg-[#0f0f0f] border-none" />
        </div>
        <Input name="jobPhoto" type="file" accept="image/*" className="bg-[#0f0f0f] border-none" />
        <Button type="submit" variant="neon-green">Add Job</Button>
      </form>

      <div className="flex gap-4 mb-4">
        <Input 
            id="searchJobs"
            placeholder="Search jobs..."
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-[#151515] border-none"
        />
        <Button onClick={exportCSV} variant="neon-green">Export CSV</Button>
      </div>
      
      <div id="jobsList" className="space-y-4">
        {filteredJobs.map(job => (
            <Card key={job.id} className="bg-[#151515] border-l-4 border-[#1AB16A]">
                <CardContent className="p-4 space-y-2 text-sm">
                    <p><strong>Client:</strong> {job.clientName}</p>
                    <p><strong>Phone:</strong> {job.clientPhone}</p>
                    <p><strong>Address:</strong> {job.address}</p>
                    <p><strong>Status:</strong> {job.status}</p>
                    <p><strong>Date:</strong> {job.date}</p>
                    {job.photo && <Image src={job.photo} alt="Job photo" width={100} height={100} className="rounded-md mt-2" />}
                     <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="destructive" onClick={() => deleteJob(job.id)}>Delete</Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

// Customers Section
function CustomersSection({ customers }: { customers: Customer[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const exportCSV = () => {
        let csv = 'Name,Email,Phone\n';
        filteredCustomers.forEach(c => csv += `${c.name},${c.email},${c.phone}\n`);
        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        a.download = 'customers.csv';
        a.click();
    }
    
    const filteredCustomers = customers.filter(c =>
        JSON.stringify(c).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Customers</h2>
            <div className="flex gap-4 mb-4">
                <Input
                    id="searchCustomers"
                    placeholder="Search customers..."
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-[#151515] border-none"
                />
                <Button onClick={exportCSV} variant="neon-green">Export CSV</Button>
            </div>
            <div id="customersList" className="space-y-4">
                {filteredCustomers.map(cust => (
                    <Card key={cust.email} className="bg-[#151515] border-l-4 border-[#1AB16A]">
                        <CardContent className="p-4 space-y-2 text-sm">
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
