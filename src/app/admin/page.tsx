
'use client';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

type Job = { 
  id:string, 
  clientName:string, 
  clientPhone:string, 
  email: string,
  address:string, 
  serviceType: string,
  propertyType: string,
  bedrooms: string,
  bathrooms: string,
  notes: string,
  status:'Pending'|'Scheduled'|'Completed', 
  date:string, 
  timestamp:number, 
};

type Message = { id:string, name:string, email:string, phone:string, message:string, timestamp:number, read:boolean };
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
          <h1 className="mb-6 font-headline text-3xl font-bold text-primary">Admin Dashboard</h1>
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
  const [activeSection,setActiveSection] = useState<'messages'|'jobs'|'customers'|'stats'>('jobs');
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
  
  useEffect(() => {
    if (jobs.length > 0 || JSON.parse(localStorage.getItem('jobs') || '[]').length > 0) {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
  }, [jobs]);

  useEffect(() => {
    if (messages.length > 0 || JSON.parse(localStorage.getItem('messages') || '[]').length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);

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
    return Array.from(customerMap.values());
  }, [messages, jobs]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <header className="bg-card border-b p-4 text-primary-foreground font-bold text-2xl text-center mb-4">
        <h1 className="font-headline text-2xl text-center font-bold text-foreground">Capital CleanOuts Dashboard</h1>
      </header>
      <nav className="flex flex-wrap gap-2 justify-center mb-4">
        <Button variant={activeSection === 'jobs' ? 'default' : 'outline'} onClick={()=>setActiveSection('jobs')}>Cleaning Jobs</Button>
        <Button variant={activeSection === 'messages' ? 'default' : 'outline'} onClick={()=>setActiveSection('messages')}>Messages</Button>
        <Button variant={activeSection === 'customers' ? 'default' : 'outline'} onClick={()=>setActiveSection('customers')}>Customers</Button>
        <Button variant={activeSection === 'stats' ? 'default' : 'outline'} onClick={()=>setActiveSection('stats')}>Job Overview</Button>
      </nav>

      <main>
        {activeSection==='messages' && <MessagesSection messages={messages} setMessages={setMessages} />}
        {activeSection==='jobs' && <JobsSection jobs={jobs} setJobs={setJobs} />}
        {activeSection==='customers' && <CustomersSection customers={customers} />}
        {activeSection==='stats' && <StatsSection jobs={jobs} setJobs={setJobs} />}
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
        <Card key={m.id} className={`mb-2 ${m.read?'opacity-60':''}`}>
          <CardContent className="p-3 text-sm space-y-1">
            <p><strong>Name:</strong> {m.name}</p>
            <p><strong>Email:</strong> {m.email}</p>
            <p><strong>Phone:</strong> {m.phone}</p>
            <p><strong>Message:</strong> {m.message}</p>
            <p className="text-xs text-muted-foreground"><strong>Date:</strong> {new Date(m.timestamp).toLocaleString()}</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={()=>toggleRead(m.id)}>{m.read?'Mark Unread':'Mark Read'}</Button>
              <Button size="sm" variant="destructive" onClick={()=>deleteMsg(m.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function JobsSection({jobs,setJobs}:{jobs:Job[],setJobs:React.Dispatch<React.SetStateAction<Job[]>>}){
  const activeJobs = jobs.filter(j => j.status !== 'Completed');

  const deleteJob=(id:string)=>setJobs(jobs.filter(j=>j.id!==id));
  const updateJobStatus = (id: string, status: 'Pending' | 'Scheduled' | 'Completed') => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
  };
  

  const exportCSV = () => {
    let csv = 'Job Type,Property Type,Bedrooms,Bathrooms,Client Name,Address,Date,Status\n';
    activeJobs.forEach(j => csv += `${j.serviceType},${j.propertyType},${j.bedrooms},${j.bathrooms},${j.clientName},"${j.address}",${j.date},${j.status}\n`);
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'active_jobs.csv';
    a.click();
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Active Cleaning Jobs ({activeJobs.length})</h2>
        <Button onClick={exportCSV} variant="outline" size="sm">Export CSV</Button>
      </div>
      {activeJobs.map(j=>(
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
              {j.status === 'Pending' && (
                <Button size="sm" variant="secondary" onClick={()=>updateJobStatus(j.id, 'Scheduled')}>Mark Scheduled</Button>
              )}
               {j.status === 'Scheduled' && (
                <Button size="sm" variant="secondary" onClick={()=>updateJobStatus(j.id, 'Pending')}>Mark Pending</Button>
              )}
              <Button size="sm" variant="default" onClick={()=>updateJobStatus(j.id, 'Completed')}>Complete</Button>
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

function StatsSection({ jobs, setJobs }: { jobs: Job[], setJobs: React.Dispatch<React.SetStateAction<Job[]>>}) {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'Completed').length;
    const pendingJobs = jobs.filter(j => j.status === 'Pending').length;
    const scheduledJobs = jobs.filter(j => j.status === 'Scheduled').length;
    
    const completedJobsData = jobs.filter(j => j.status === 'Completed');

    const updateJobStatus = (id: string, status: 'Pending' | 'Scheduled' | 'Completed') => {
        setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
    };

    const StatCard = ({ title, value }: { title: string, value: number | string }) => (
        <div className="flex-1 bg-card p-4 rounded-xl text-center border">
            <span className="text-xl font-bold">{title}</span>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );

    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Job Overview</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <StatCard title="Total Jobs" value={totalJobs} />
            <StatCard title="Completed Jobs" value={completedJobs} />
            <StatCard title="Pending" value={pendingJobs} />
            <StatCard title="Scheduled" value={scheduledJobs} />
        </div>

        <h3 className="text-lg font-bold mt-6 mb-2">Completed Jobs Details</h3>
        {completedJobsData.map(j=>(
        <Card key={j.id} className="mb-2">
          <CardContent className="p-4 space-y-2 text-sm">
             <div className="flex justify-between items-start">
              <div>
                <p><strong>Client:</strong> {j.clientName} ({j.clientPhone})</p>
                <p><strong>Address:</strong> {j.address}</p>
              </div>
              <div className="text-right">
                <p><strong>Status:</strong> {j.status}</p>
                <p><strong>Date:</strong> {j.date}</p>
              </div>
            </div>
            <div className='bg-muted/50 p-3 rounded-md mt-2'>
              <p><strong>Job:</strong> {j.serviceType} ({j.propertyType})</p>
              <p><strong>Size:</strong> {j.bedrooms} Bed, {j.bathrooms} Bath</p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={()=>updateJobStatus(j.id, 'Pending')}>Uncomplete</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      </div>
    );
}
