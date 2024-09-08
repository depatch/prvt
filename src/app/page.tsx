import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '../styles/page.module.css';
import Header from '@/components/Header';

const DynamicConnectWalletButton = dynamic(() => import('../components/ConnectWalletButton'), { ssr: false });

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.contentContainer}>
        <h1 className={styles.welcomeHeader}>Welcome to PRVT Chat App</h1>
        <p className={styles.description}>Secure, blockchain-integrated communication</p>
        <div className={styles.buttonContainer}>
          <Link href="/home" className={styles.launchAppButton}>
            Launch App
          </Link>
        </div>
      </div>
    </main>
  );
}