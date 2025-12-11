
'use client';

import { useRouter } from 'next/navigation';

export function AdminTrigger() {
  const router = useRouter();

  const handleAdminAccess = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the underlying Link from navigating
    event.preventDefault();
    event.stopPropagation();
    
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '1234';
    const input = prompt('Enter admin password:');
    if (input === ADMIN_PASSWORD) {
      router.push('/admin');
    } else if (input !== null && input !== "") {
      alert('Incorrect password.');
    }
  };

  return (
    <button
      onClick={handleAdminAccess}
      className="absolute inset-0 z-10 h-full w-full bg-transparent"
      aria-label="Open Admin Login"
    />
  );
}
