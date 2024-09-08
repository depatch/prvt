import React from 'react';
import { Client } from '@xmtp/xmtp-js';
import styles from '../styles/Sidebar.module.css';

interface SidebarProps {
  setActiveChat: (chat: any) => void;
  setActiveAgent: (agent: string | null) => void;
  xmtpClient: Client<any> | null;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveChat, setActiveAgent, xmtpClient }) => {
  return (
    <div className={styles.sidebar} style={{
      borderRadius: 'var(--radius-2xl, 16px)',
      background: 'var(--background-surface-default, #0B0C0E)'
    }}>
      {/* Component JSX here */}
    </div>
  );
};

export default Sidebar;