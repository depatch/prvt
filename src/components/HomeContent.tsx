'use client'

import React, { useState } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { useXmtp } from '../hooks/useXMTP';
import ConnectWalletButton from './ConnectWalletButton';
import KintoVerification from './KintoVerification';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import styles from './HomeContent.module.css';

const HomeContent: React.FC = () => {
  const { isConnected, address, provider, isInitialized, connect } = useWeb3Auth();
  const { xmtpClient, isXmtpLoading, xmtpError } = useXmtp(provider);
  const [activeChat, setActiveChat] = useState<any>(null);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <h1>Welcome to the PRVT Chat App</h1>
        <p>Please connect your wallet to access the app.</p>
        <ConnectWalletButton onClick={connect} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Welcome to the PRVT Chat App</h1>
      <p>Connected address: {address}</p>
      
      {/* Assuming you have a way to check if the user is Kinto verified */}
      {/* {user && !user.isKintoVerified && <KintoVerification />} */}

      {isXmtpLoading ? (
        <p>Initializing XMTP client...</p>
      ) : xmtpError ? (
        <div>
          <p>Error: {xmtpError}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : xmtpClient ? (
        <div className={styles.chatContainer}>
          <ChatList setActiveChat={setActiveChat} provider={provider} />
          <ChatWindow conversation={activeChat} provider={provider} />
        </div>
      ) : (
        <p>Failed to initialize XMTP client. Please check your connection and try again.</p>
      )}
    </div>
  );
};

export default HomeContent;