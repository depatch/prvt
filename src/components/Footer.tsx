import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} PRVT Chat. All rights reserved.</p>
      </div>
    </footer>
  );
}