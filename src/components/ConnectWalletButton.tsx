'use client';

import React, { useState } from 'react';
import styles from '../styles/ConnectWalletButton.module.css';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { useRouter } from 'next/navigation';

const ConnectWalletButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { connect } = useWeb3Auth();
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await connect();
      // Refresh the page after successful connection
      router.refresh();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading} className={styles.connectWalletButton}>
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWalletButton;