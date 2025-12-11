
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Check for session/local storage to maintain login state
    useEffect(() => {
        if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        if (password === '1234') {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password.');
            setPassword('');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        setIsAuthenticated(false);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    if (isAuthenticated) {
        return (
             <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
                </div>
                <p>Welcome to the admin dashboard. This area is under construction.</p>
                <p className="mt-4">You can now add Firebase-powered features here, such as:</p>
                <ul className="list-disc list-inside mt-2">
                    <li>Viewing contact form messages from Firestore.</li>
                    <li>Managing job bookings.</li>
                    <li>Viewing customer data.</li>
                </ul>
            </div>
        )
    }

    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-background p-4">
            <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
                <h1 className="mb-6 text-center font-headline text-3xl font-bold text-primary">
                    Admin Access
                </h1>
                <div className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Password"
                        className="w-full rounded-md border border-input bg-transparent px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                     {error && <p className="text-sm text-center text-destructive">{error}</p>}
                    <button
                        onClick={handleLogin}
                        className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
