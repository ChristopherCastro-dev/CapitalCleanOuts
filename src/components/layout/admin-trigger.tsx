
'use client';

import { useState } from 'react';
import { PasswordModal } from './password-modal';

export function AdminTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onDoubleClick={() => setIsModalOpen(true)}
        className="absolute inset-0 z-10 h-full w-full bg-transparent"
        aria-label="Open Admin Login"
      />
      <PasswordModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
