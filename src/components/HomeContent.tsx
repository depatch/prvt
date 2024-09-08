'use client'

import React, { useState, useEffect } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { useXmtp } from '../hooks/useXMTP';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import UserProfile from './UserProfile';
import styles from '../styles/home.module.css';

const HomeContent: React.FC = () => {
  const { isConnected, address, isInitialized, error } = useWeb3Auth();
  const [activeChat, setActiveChat] = useState<any>(null);
  const { xmtpClient, isLoading: isXmtpLoading, error: xmtpError } = useXmtp();

  useEffect(() => {
    if (error) {
      console.error("Web3Auth error:", error);
    }
  }, [error]);

  if (!isInitialized || isXmtpLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!isConnected) {
    return <div className={styles.notConnected}>Please connect your wallet to use the chat.</div>;
  }

  return (
    <div className={styles.content}>
      <aside className={styles.sidebar}>
        <UserProfile />
        <ChatList setActiveChat={setActiveChat} />
      </aside>
      <main className={styles.mainContent}>
        {xmtpError ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>Error: {xmtpError}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : xmtpClient ? (
          activeChat ? (
            <ChatWindow conversation={activeChat} />
          ) : (
            <div className={styles.welcomeMessage}>
              <h2>Welcome to PRVT Chat App</h2>
              <p>Select a chat to get started or create a new conversation.</p>
            </div>
          )
        ) : (
          <p className={styles.errorText}>Failed to initialize XMTP client. Please check your connection and try again.</p>
        )}
      </main>
    </div>
  );
};

export default HomeContent;