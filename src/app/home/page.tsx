'use client'

import dynamic from 'next/dynamic'
import styles from './home.module.css';

const DynamicHomeContent = dynamic(() => import('../../components/HomeContent'), { ssr: false })

export default function HomePage() {
  return (
    <main>
      <h1>PRVT Chat App Dashboard</h1>
      <DynamicHomeContent />
    </main>
  );
}