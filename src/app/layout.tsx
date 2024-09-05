'use client'; // Add this at the top of the file

import React from 'react';
import "./globals.css";
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MessageProvider } from '@/contexts/MessageContext'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  return (
    <html lang="en">
      <body>
        <MessageProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            {!isLandingPage && <Header />}
            <main className="flex-1 flex">
              {children}
            </main>
            {!isLandingPage && <Footer />}
          </div>
        </MessageProvider>
      </body>
    </html>
  );
}
