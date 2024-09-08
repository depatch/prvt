'use client'

import dynamic from 'next/dynamic'
import styles from '../../styles/home.module.css';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import Header from '@/components/Header';

const DynamicHomeContent = dynamic(() => import('../../components/HomeContent'), { ssr: false })

export default function HomePage() {
  const { isConnected } = useWeb3Auth();

  return (
    <div className={styles.container} style={{ background: 'var(--background-button-primary-hover, #1F2228)' }}>
      <main className={styles.main} style={{
        padding: 'var(--spacing-32, 32px) var(--spacing-120, 120px)',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        display: 'flex'
      }}>
        {isConnected ? (
          <DynamicHomeContent />
        ) : (
          <div className={styles.connectWalletContainer}>
            <h1>Welcome to PRVT Chat App</h1>
            <p>Connect your wallet to start chatting</p>
            <ConnectWalletButton />
          </div>
        )}
      </main>
    </div>
  );
}

