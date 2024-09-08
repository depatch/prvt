'use client'

import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext';
import { ReactNode } from 'react';
import styles from '../styles/layout.module.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: 'var(--background-button-primary-hover, #1F2228)' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}