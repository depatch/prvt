'use client'

import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext';
import { ReactNode } from 'react';
import styles from '../styles/layout.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <AuthProvider>
          <div className={styles.headerWrapper}>
            <Header />
          </div>
          <main className={styles.main}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}