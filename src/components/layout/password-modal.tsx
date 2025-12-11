
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type PasswordModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const ADMIN_PASSWORD = '1234';

export function PasswordModal({ isOpen, onOpenChange }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handlePasswordCheck = () => {
    if (password === ADMIN_PASSWORD) {
      router.push('/admin');
      onOpenChange(false);
    } else {
      setError('Incorrect password.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePasswordCheck();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Access</DialogTitle>
          <DialogDescription>
            Enter the password to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="admin-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="col-span-3"
          />
          {error && (
            <p className="text-sm font-medium text-destructive text-center">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handlePasswordCheck}>
            Enter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
