import React from 'react';
import { Client } from '@xmtp/xmtp-js';
import styles from './MainContent.module.css';

export interface MainContentProps {
  activeChat: any;
  activeAgent: string | null;
  xmtpClient: Client<any> | null;
}

const MainContent: React.FC<MainContentProps> = ({ activeChat, activeAgent, xmtpClient }) => {
  // Component logic here
  return (
    <div>
      {/* Component JSX here */}
    </div>
  );
};

export default MainContent;