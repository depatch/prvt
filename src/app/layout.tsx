'use client'

import './globals.css'
import { AuthProvider } from './context/AuthContext';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}