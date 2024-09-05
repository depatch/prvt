import { useState, useEffect } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'XMTPMessages';
const STORE_NAME = 'messages';

async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
}

export function useXMTP(wallet: Wallet | null) {
  const [client, setClient] = useState<Client | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initXMTP = async () => {
      if (wallet) {
        try {
          const xmtp = await Client.create(wallet, { env: "production" });
          setClient(xmtp);
          console.log("XMTP client created", xmtp.address);
        } catch (error) {
          console.error("Failed to create XMTP client:", error);
          setError("Failed to initialize XMTP client. Please try again.");
        }
      }
    };

    initXMTP();
  }, [wallet]);

  const startConversation = async (peerAddress: string) => {
    if (client) {
      try {
        const canMessage = await client.canMessage(peerAddress);
        if (canMessage) {
          const conversation = await client.conversations.newConversation(peerAddress);
          setConversations(prev => [...prev, conversation]);
          return conversation;
        } else {
          setError("Cannot message this address. They may not have XMTP enabled.");
          return null;
        }
      } catch (error) {
        console.error("Failed to start conversation:", error);
        setError("Failed to start conversation. Please try again.");
        return null;
      }
    }
    return null;
  };

  const sendMessage = async (conversation: any, content: string) => {
    if (conversation) {
      try {
        const message = await conversation.send(content);
        console.log(`Message sent: "${message.content}"`);
        await saveMessageToIndexedDB(message);
        return message;
      } catch (error) {
        console.error("Failed to send message:", error);
        setError("Failed to send message. Please try again.");
        return null;
      }
    }
    return null;
  };

  const streamAllMessages = async (callback: (message: any) => void) => {
    if (client) {
      try {
        for await (const message of await client.conversations.streamAllMessages()) {
          callback(message);
          await saveMessageToIndexedDB(message);
        }
      } catch (error) {
        console.error("Error streaming messages:", error);
        setError("Error receiving messages. Please refresh the page.");
      }
    }
  };

  const loadConversations = async () => {
    if (client) {
      try {
        const convos = await client.conversations.list();
        setConversations(convos);
        
        // Load persisted messages from IndexedDB
        for (const convo of convos) {
          const messages = await getMessagesFromIndexedDB(convo.topic);
          for (const message of messages) {
            // Trigger the callback to add the message to the UI
            streamAllMessages((msg) => msg);
          }
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
        setError("Failed to load conversations. Please try again.");
      }
    }
  };

  const loadMoreMessages = async (conversation: any, before: Date, limit: number = 20) => {
    if (conversation) {
      try {
        const messages = await conversation.messages({ before, limit });
        for (const message of messages) {
          await saveMessageToIndexedDB(message);
        }
        return messages;
      } catch (error) {
        console.error("Failed to load more messages:", error);
        setError("Failed to load more messages. Please try again.");
        return [];
      }
    }
    return [];
  };

  async function saveMessageToIndexedDB(message: any) {
    const db = await getDb();
    await db.put(STORE_NAME, {
      id: message.id,
      conversationTopic: message.conversation.topic,
      ...message
    });
  }

  async function getMessagesFromIndexedDB(conversationTopic: string) {
    const db = await getDb();
    return db.getAllFromIndex(STORE_NAME, 'conversationTopic', conversationTopic);
  }

  useEffect(() => {
    if (client) {
      loadConversations();
    }
  }, [client]);

  return { 
    client, 
    conversations, 
    startConversation, 
    sendMessage, 
    streamAllMessages, 
    loadConversations, 
    loadMoreMessages,
    error,
    clearError: () => setError(null)
  };
}
