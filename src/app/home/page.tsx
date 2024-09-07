'use client'

import dynamic from 'next/dynamic'
import styles from './home.module.css';

const DynamicHomeContent = dynamic(() => import('../../components/HomeContent'), { ssr: false })

export default function HomePage() {
  return (
    <main className={styles.main}>
      <DynamicHomeContent />
    </main>
  );
}