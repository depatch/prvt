'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '../styles/page.module.css';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const DynamicConnectWalletButton = dynamic(() => import('../components/ConnectWalletButton'), { ssr: false });

export default function Home() {
  const { isConnected, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isConnected) {
        if (user?.isCompleteProfile) {
          router.push('/home');
        } else {
          router.push('/complete-profile');
        }
      }
    }
  }, [isConnected, user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (

    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          <h1 className={styles.title}>Chat app with built-in privacy & a dApp store</h1>
          <div className={styles.tags}>
            #chat  #clubs  #perks  #easy-to-use  #AI  #on-chain
          </div>
          <div className={styles.buttonContainer}>
            {!isConnected && (
              <DynamicConnectWalletButton />
            )}
            {isConnected && !user?.isCompleteProfile && (
              <Link href="/complete-profile" className={styles.launchAppButton}>
                Complete Profile
              </Link>
            )}
            {isConnected && user?.isCompleteProfile && (
              <Link href="/home" className={styles.launchAppButton}>
                Launch App
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
