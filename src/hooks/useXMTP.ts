import { useState, useEffect, useCallback } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { useWeb3Auth } from './useWeb3Auth';

export function useXmtp() {
	const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { web3auth, isConnected, address, provider } = useWeb3Auth();

	useEffect(() => {
		const initXmtp = async () => {
			if (isConnected && provider && address) {
				try {
					setIsLoading(true);
					setError(null);
					
					// Create an ethers provider from the Web3Auth provider
					const ethersProvider = new ethers.BrowserProvider(provider);
					// Get the signer
					const signer = await ethersProvider.getSigner();
					// Create the XMTP client
					const client = await Client.create(signer, { env: "dev" });
					console.log("Client created", client.address);
					setXmtpClient(client);
				} catch (error) {
					console.error('Error initializing XMTP client:', error);
					setError('Failed to initialize XMTP client. Please try again.');
				} finally {
					setIsLoading(false);
				}
			} else {
				setXmtpClient(null);
				setIsLoading(false);
			}
		};

		initXmtp();
	}, [isConnected, address, provider]);

	const canMessage = useCallback(async (addressToCheck: string): Promise<boolean> => {
		if (!xmtpClient) return false;
		return await xmtpClient.canMessage(addressToCheck);
	}, [xmtpClient]);

	const sendMessage = async (conversationId: string, content: string) => {
		if (!xmtpClient) return;
		try {
			const conversation = await xmtpClient.conversations.newConversation(conversationId);
			await conversation.send(content);
		} catch (error) {
			console.error('Failed to send message:', error);
		}
	};

	const listenForMessages = (conversationId: string, callback: (message: any) => void) => {
		if (!xmtpClient) return () => {};
		const stream = xmtpClient.conversations.streamAllMessages();
		const subscription = stream.subscribe((message) => {
			if (message.conversation.topic === conversationId) {
				callback(message);
			}
		});
		return () => subscription.unsubscribe();
	};

	return { xmtpClient, canMessage, isLoading, error, sendMessage, listenForMessages };
}