import React from 'react';
import "./globals.css";

export const metadata = {
  title: 'PRVT Chat',
  description: 'A decentralized chat application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
