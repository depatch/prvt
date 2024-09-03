import { useState, useEffect, useCallback } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { useWeb3Auth } from './useWeb3Auth';

export function useXMTP() {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { connect, disconnect, isConnected, address } = useWeb3Auth();

  const initXMTP = useCallback(async () => {
    if (!isConnected) {
      setError('Web3 provider not available');
      return;
    }

    try {
      // Use connect() to get the provider if needed
      const provider = await connect();
      if (provider === undefined || provider === null) {
        setError('Failed to get provider');
        return;
      }
      const xmtp = await Client.create(provider);
      setClient(xmtp);
      setError(null);
    } catch (error) {
      console.error('Error initializing XMTP client:', error);
      setError('Failed to initialize XMTP client');
    }
  }, [connect, isConnected]);

  useEffect(() => {
    if (isConnected && !client) {
      initXMTP();
    } else if (!isConnected && client) {
      // Clear client when connection becomes unavailable
      setClient(null);
    }
  }, [isConnected, client, initXMTP]);

  const sendMessage = useCallback(async (recipient: string, content: string) => {
    if (!client) {
      setError('XMTP client not initialized');
      return;
    }

    try {
      const conversation = await client.conversations.newConversation(recipient);
      await conversation.send(content);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  }, [client]);

  return { client, sendMessage, error };
}
