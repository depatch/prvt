import React from 'react';
import { Client } from '@xmtp/xmtp-js';
import styles from '../styles/MainContent.module.css';
import ChatWindow from './ChatWindow';
import ClubFinderAgent from './ClubFinderAgent';
import ClubCreatorAgent from './ClubCreatorAgent';

export interface MainContentProps {
  activeChat: any;
  activeAgent: string | null;
  xmtpClient: Client<any> | null;
}

const MainContent: React.FC<MainContentProps> = ({ activeChat, activeAgent, xmtpClient }) => {
  return (
    <div className={styles.mainContent}>
      {activeChat && <ChatWindow conversation={activeChat} />}
      {activeAgent === 'finder' && <ClubFinderAgent />}
      {activeAgent === 'creator' && <ClubCreatorAgent />}
      {!activeChat && !activeAgent && (
        <div className={styles.welcomeMessage}>
          <h2>Welcome to PRVT Chat App</h2>
          <p>Select a chat or use an agent to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MainContent;