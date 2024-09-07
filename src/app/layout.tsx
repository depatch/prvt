'use client'

import './globals.css'
import { AuthProvider } from '../context/AuthContext';
import { ReactNode } from 'react';
import styles from './layout.module.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}