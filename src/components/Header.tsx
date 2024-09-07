import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>○ Private</div>
      <div className={styles.userInfo}>
        <span className={styles.userName}>aysipixie.eth</span>
        <span className={styles.userEmoji}>👤</span>
      </div>
    </header>
  );
};

export default Header;