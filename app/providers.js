'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from './lib/auth';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
} 