'use client';

import React, { useState } from 'react';

interface ConnectWalletButtonProps {
  onClick: () => Promise<void>;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWalletButton;