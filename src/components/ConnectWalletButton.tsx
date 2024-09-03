import React from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';
import { Button } from './ui/button';

interface ConnectWalletButtonProps {
  className?: string;
  // ... other props
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className, ...props }) => {
	const { connect, disconnect, isConnected, address } = useWeb3Auth();

	// Add a loading state to handle connection status
	const [loading, setLoading] = React.useState(false);

	const handleClick = async () => {
		setLoading(true);
		try {
			isConnected ? await disconnect() : await connect();
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button onClick={handleClick} variant="outline" disabled={loading} className={className} {...props}>
			{loading ? 'Loading...' : (isConnected ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})` : 'Connect Wallet')}
		</Button>
	);
}