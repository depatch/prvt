'use client'

import React, { useState, useEffect } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { useXmtp } from '../hooks/useXMTP';
import useGaladriel from '../hooks/useGaladriel'; // useGaladriel hook'unu doğru şekilde içe aktarın
import ConnectWalletButton from './ConnectWalletButton';
import KintoVerification from './KintoVerification';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ClubFinderAgent from './ClubFinderAgent';
import ClubCreatorAgent from './ClubCreatorAgent';
import styles from './HomeContent.module.css';

const HomeContent: React.FC = () => {
  const { isConnected, address, provider, isInitialized, connect } = useWeb3Auth();
  const { messages, sendMessage, chatId } = useGaladriel();
  const [activeChat, setActiveChat] = useState<any>(null);
  const [isXmtpInitializing, setIsXmtpInitializing] = useState(true);

  // Pass isConnected, address, and provider to useXmtp
  const { xmtpClient, canMessage, isLoading: isXmtpLoading, error: xmtpError } = useXmtp(
    isConnected,
    address,
    provider
  );

  useEffect(() => {
    if (!isXmtpLoading && (xmtpClient || xmtpError)) {
      setIsXmtpInitializing(false);
    }
  }, [isXmtpLoading, xmtpClient, xmtpError]);

  if (!isInitialized) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <h2 className={styles.welcomeTitle}>Welcome to the PRVT Chat App</h2>
        <p className={styles.welcomeText}>Please connect your wallet to access the app.</p>
        <ConnectWalletButton onClick={connect} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.welcomeTitle}>Welcome to the PRVT Chat App</h2>
      <p className={styles.addressText}>Connected address: {address}</p>

      <KintoVerification />
      <button onClick={() => sendMessage("Test message" + messages.length + chatId)}>Send Test Message</button> {/* Test butonu ekleyin */}
      {isXmtpInitializing ? (
        <p className={styles.loadingText}>Initializing XMTP client...</p>
      ) : xmtpError ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>Error: {xmtpError}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : xmtpClient ? (
        <div className={styles.contentContainer}>
          <div className={styles.chatContainer}>
            <ChatList setActiveChat={setActiveChat} provider={provider} isConnected={isConnected} address={address}/>
            <ChatWindow conversation={activeChat} provider={provider} isConnected={isConnected} address={address}/>
          </div>
          <div className={styles.agentContainer}>
            <ClubFinderAgent />
            <ClubCreatorAgent />
          </div>
        </div>
      ) : (
        <p className={styles.errorText}>Failed to initialize XMTP client. Please check your connection and try again.</p>
      )}
    </div>
  );
};

export default HomeContent;