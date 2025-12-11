
'use client';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

type Message = { id:string, name:string, email:string, phone:string, message:string, timestamp:number, read:boolean };
type Job = { id:string, clientName:string, clientPhone:string, address:string, status:'Pending'|'In Progress'|'Completed', date:string, timestamp:number, photo?: string, junkVolume?: string, price?: string };
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
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg text-center">
          <h1 className="mb-6 font-headline text-3xl font-bold text-primary">Admin Dashboard</h1>
          <Input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Password" 
            className="bg-input text-center text-lg"
          />
          <Button onClick={handleLogin} variant="neon-green" className="mt-4 w-full">Enter</Button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard(){
  const [activeSection,setActiveSection] = useState<'messages'|'jobs'|'customers'|'stats'>('messages');
  const [messages,setMessages] = useState<Message[]>([]);
  const [jobs,setJobs] = useState<Job[]>([]);

  useEffect(()=>{
    const loadData = () => {
      setMessages(JSON.parse(localStorage.getItem('messages') || '[]'));
      setJobs(JSON.parse(localStorage.getItem('jobs') || '[]'));
    };

    loadData();

    window.addEventListener('messages-updated', loadData);
    window.addEventListener('jobs-updated', loadData);
    window.addEventListener('storage', loadData);

    return ()=>{
      window.removeEventListener('messages-updated', loadData);
      window.removeEventListener('jobs-updated', loadData);
      window.removeEventListener('storage', loadData);
    }
  },[]);

  // Persist state changes back to localStorage
  useEffect(() => { 
    // Only write to localStorage if messages state is not empty, to avoid overwriting on initial mount
    if (messages.length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages)); 
    }
  }, [messages]);

  useEffect(() => { 
    if (jobs.length > 0) {
      localStorage.setItem('jobs', JSON.stringify(jobs)); 
    }
  }, [jobs]);

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
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4">
      <header className="bg-[#1AB16A] p-4 text-black font-bold text-2xl text-center mb-4">JUNKXPRESS Dashboard</header>
      <nav className="flex flex-wrap gap-2 justify-center mb-4">
        <Button variant={activeSection === 'messages' ? 'default' : 'neon-green'} onClick={()=>setActiveSection('messages')}>Messages</Button>
        <Button variant={activeSection === 'jobs' ? 'default' : 'neon-green'} onClick={()=>setActiveSection('jobs')}>Jobs</Button>
        <Button variant={activeSection === 'customers' ? 'default' : 'neon-green'} onClick={()=>setActiveSection('customers')}>Customers</Button>
        <Button variant={activeSection === 'stats' ? 'default' : 'neon-green'} onClick={()=>setActiveSection('stats')}>Stats</Button>
      </nav>

      <main>
        {activeSection==='messages' && <MessagesSection messages={messages} setMessages={setMessages} />}
        {activeSection==='jobs' && <JobsSection jobs={jobs} setJobs={setJobs} />}
        {activeSection==='customers' && <CustomersSection customers={customers} />}
        {activeSection==='stats' && <StatsSection jobs={jobs} />}
      </main>
    </div>
  );
}

function MessagesSection({messages,setMessages}:{messages:Message[],setMessages:React.Dispatch<React.SetStateAction<Message[]>>}){
  const toggleRead=(id:string)=>setMessages(messages.map(m=>m.id===id?{...m,read:!m.read}:m));
  const deleteMsg=(id:string)=>setMessages(messages.filter(m=>m.id!==id));

  const exportCSV = () => {
    let csv = 'Name,Email,Phone,Message,Date\n';
    messages.forEach(m => {
        const message = m.message.replace(/,/g, '');
        csv += `${m.name},${m.email},${m.phone},"${message}",${new Date(m.timestamp).toLocaleString()}\n`
    });
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'messages.csv';
    a.click();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Messages</h2>
        <Button onClick={exportCSV} variant="outline" size="sm">Export CSV</Button>
      </div>
      {messages.map(m=>(
        <Card key={m.id} className={`mb-2 border-l-4 bg-[#151515] border-[#1AB16A] ${m.read?'opacity-60':''}`}>
          <CardContent className="p-3 text-sm space-y-1">
            <p><strong>Name:</strong> {m.name}</p>
            <p><strong>Email:</strong> {m.email}</p>
            <p><strong>Phone:</strong> {m.phone}</p>
            <p><strong>Message:</strong> {m.message}</p>
            <p className="text-xs text-muted-foreground"><strong>Date:</strong> {new Date(m.timestamp).toLocaleString()}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={()=>toggleRead(m.id)}>{m.read?'Mark Unread':'Mark Read'}</Button>
              <Button size="sm" variant="destructive" onClick={()=>deleteMsg(m.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function JobsSection({jobs,setJobs}:{jobs:Job[],setJobs:React.Dispatch<React.SetStateAction<Job[]>>}){
  const deleteJob=(id:string)=>setJobs(jobs.filter(j=>j.id!==id));

  const exportCSV = () => {
    let csv = 'Client,Phone,Address,Status,Date,Volume,Price\n';
    jobs.forEach(j => csv += `${j.clientName},${j.clientPhone},"${j.address}",${j.status},${j.date},${j.junkVolume || ''},${j.price || ''}\n`);
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'jobs.csv';
    a.click();
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Jobs</h2>
        <Button onClick={exportCSV} variant="outline" size="sm">Export CSV</Button>
      </div>
      {jobs.map(j=>(
        <Card key={j.id} className="mb-2 bg-[#151515] border-l-4 border-[#1AB16A]">
          <CardContent className="p-3 text-sm space-y-1">
            <p><strong>Client:</strong> {j.clientName}</p>
            <p><strong>Phone:</strong> {j.clientPhone}</p>
            <p><strong>Address:</strong> {j.address}</p>
            <p><strong>Status:</strong> {j.status}</p>
            <p><strong>Date:</strong> {j.date}</p>
            {j.junkVolume && <p><strong>Volume:</strong> {j.junkVolume}</p>}
            {j.price && <p><strong>Est. Price:</strong> {j.price}</p>}
            {j.photo && <Image src={j.photo} alt="Job photo" width={100} height={100} className="rounded-md mt-2" />}
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="destructive" onClick={()=>deleteJob(j.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CustomersSection({ customers }: { customers: Customer[] }) {
    const exportCSV = () => {
        let csv = 'Name,Email,Phone\n';
        customers.forEach(c => csv += `${c.name},${c.email},${c.phone}\n`);
        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        a.download = 'customers.csv';
        a.click();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Customers</h2>
                <Button onClick={exportCSV} variant="outline" size="sm">Export CSV</Button>
            </div>
            {customers.map(cust => (
                <Card key={cust.email} className="mb-2 bg-[#151515] border-l-4 border-[#1AB16A]">
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

function StatsSection({ jobs }: { jobs: Job[] }) {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'Completed').length;
    const pendingJobs = jobs.filter(j => j.status === 'Pending').length;

    const StatCard = ({ title, value }: { title: string, value: number | string }) => (
        <div className="flex-1 bg-[#151515] p-4 rounded-lg text-center border-l-4 border-[#1AB16A]">
            <span className="text-xl font-bold">{title}</span>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );

    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Stats</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <StatCard title="Total Jobs" value={totalJobs} />
            <StatCard title="Completed Jobs" value={completedJobs} />
            <StatCard title="Pending Jobs" value={pendingJobs} />
        </div>
      </div>
    );
}
    