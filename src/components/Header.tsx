import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>PRVT Chat App</div>
      {/* Add any other header content here */}
    </header>
  );
};

export default Header;