import React from 'react';
import styles from '../styles/Header.module.css';
import Image from 'next/image';
import prvtLogo from '../svgs/prvt-logo.svg';
import ConnectWalletButton from './ConnectWalletButton';

const Header: React.FC = () => {
  return (
    <header className={styles.header} style={{ background: 'var(--background-surface-default, #0B0C0E)' }}>
      <div className={styles.logoContainer}>
        <Image 
          src={prvtLogo}
          alt="PRVT Logo" 
          width={109}
          height={24}
          className={styles.logo}
          onError={(e) => {
            console.error('Error loading SVG:', e);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      <ConnectWalletButton />
    </header>
  );
};

export default Header;