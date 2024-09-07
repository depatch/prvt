import React from 'react';

interface ConnectWalletButtonProps {
  onClick: () => Promise<void>;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;