import React from 'react';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header} style={{ background: 'var(--background-surface-default, #0B0C0E)' }}>
      <div className={styles.logo}>PRVT Chat App</div>
      {/* Add any other header content here */}
    </header>
  );
};

export default Header;