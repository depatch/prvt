'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/ConnectWalletButton.module.css';
import { useAuth } from '@/context/AuthContext';

const ConnectWalletButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, user, connectWallet } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('ConnectWalletButton: isConnected:', isConnected, 'user:', user);
  }, [isConnected, user]);
  
  const handleClick = async () => {
    console.log('ConnectWalletButton clicked');
    if (isConnected) {
      console.log('Already connected');
      if (user?.isCompleteProfile) {
        console.log('Profile complete, navigating to /home');
        router.push('/home');
      } else {
        console.log('Profile incomplete, navigating to /complete-profile');
        router.push('/complete-profile');
      }
      return;
    }

    setIsLoading(true);
    try {
      console.log('Connecting wallet');
      await connectWallet();
      console.log('Wallet connected');
      // After connecting,
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading} className={styles.connectWalletButton}>
      {isLoading ? 'Connecting...' : isConnected ? (user?.isCompleteProfile ? 'Go to Home' : user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : 'Web3Auth Wallet Address') : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWalletButton;