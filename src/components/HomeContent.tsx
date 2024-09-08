'use client'

import React, { useState, useEffect } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { useXmtp } from '../hooks/useXMTP';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import UserProfile from './UserProfile';
import styles from '../styles/home.module.css';
import { ClubCreatorConversation } from './ClubCreatorConversation';

const HomeContent: React.FC = () => {
  const { isConnected, address, isInitialized, error } = useWeb3Auth();
  const [activeChat, setActiveChat] = useState<any>(null);
  const { xmtpClient, isLoading: isXmtpLoading, error: xmtpError } = useXmtp();
  const [isCreatingClub, setIsCreatingClub] = useState(false);

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

  const handleStartClubCreation = () => {
    setIsCreatingClub(true);
    setActiveChat(null);
  };

  return (
    <div className={styles.content}>
      <aside className={styles.sidebar}>
        <UserProfile />
        <button onClick={handleStartClubCreation} className={styles.createClubButton}>
          Create a Club
        </button>
        <ChatList setActiveChat={setActiveChat} />
      </aside>
      <main className={styles.mainContent}>
        {xmtpError ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>Error: {xmtpError}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : xmtpClient ? (
          isCreatingClub ? (
            <ClubCreatorConversation onClose={() => setIsCreatingClub(false)} />
          ) : activeChat ? (
            <ChatWindow conversation={activeChat} />
          ) : (
            <div className={styles.welcomeMessage}>
              <h2>Welcome to PRVT Chat App</h2>
              <p>Select a chat to get started or create a new club.</p>
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