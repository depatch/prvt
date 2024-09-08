'use client'

import React, { useState, useEffect } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { useXmtp } from '../hooks/useXMTP';
import useGaladriel from '../hooks/useGaladriel';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ClubFinderAgent from './ClubFinderAgent';
import ClubCreatorAgent from './ClubCreatorAgent';
import ClubList from './ClubList';
import UserProfile from './UserProfile';
import styles from '../styles/home.module.css';

const HomeContent: React.FC = () => {
  const { isConnected, address, provider, isInitialized, error } = useWeb3Auth();
  const { messages, sendMessage, chatId } = useGaladriel();
  const [activeChat, setActiveChat] = useState<any>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isXmtpInitializing, setIsXmtpInitializing] = useState(true);

  const { xmtpClient, canMessage, isLoading: isXmtpLoading, error: xmtpError } = useXmtp();

  useEffect(() => {
    if (!isXmtpLoading && (xmtpClient || xmtpError)) {
      setIsXmtpInitializing(false);
    }
  }, [isXmtpLoading, xmtpClient, xmtpError]);

  useEffect(() => {
    if (error) {
      console.error("Web3Auth error:", error);
    }
  }, [error]);

  if (!isInitialized) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.content}>
      <aside className={styles.sidebar}>
        <UserProfile />
        <ChatList setActiveChat={setActiveChat} />
        <ClubList />
        <div className={styles.agentButtons}>
          <button className={styles.agentButton} onClick={() => setActiveAgent('finder')}>
            <span className={styles.emoji}>🔍</span> Club finder agent
          </button>
          <button className={styles.agentButton} onClick={() => setActiveAgent('creator')}>
            <span className={styles.emoji}>🛠️</span> Club creator agent
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {isXmtpInitializing ? (
          <p className={styles.loadingText}>Initializing XMTP client...</p>
        ) : xmtpError ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>Error: {xmtpError}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : xmtpClient ? (
          <>
            {activeChat && <ChatWindow conversation={activeChat} />}
            {activeAgent === 'finder' && <ClubFinderAgent />}
            {activeAgent === 'creator' && <ClubCreatorAgent />}
            {!activeChat && !activeAgent && (
              <div className={styles.welcomeMessage}>
                <h2>Welcome to PRVT Chat App</h2>
                <p>Select a chat or use an agent to get started.</p>
              </div>
            )}
          </>
        ) : (
          <p className={styles.errorText}>Failed to initialize XMTP client. Please check your connection and try again.</p>
        )}
      </main>
    </div>
  );
};

export default HomeContent;