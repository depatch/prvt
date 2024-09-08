import React, { useState, useEffect } from 'react';
import { useXmtp } from '@/hooks/useXMTP';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/ClubCreatorConversation.module.css';

export function ClubCreatorConversation({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const { user } = useAuth();
  const { xmtpClient, sendMessage } = useXmtp();
  const [conversation, setConversation] = useState<any>(null);

  useEffect(() => {
    const initConversation = async () => {
      if (xmtpClient) {
        const newConversation = await xmtpClient.conversations.newConversation(process.env.NEXT_PUBLIC_CLUB_CREATOR_ADDRESS!);
        setConversation(newConversation);
        await newConversation.send("I'd like to create a new club");
      }
    };
    initConversation();
  }, [xmtpClient]);

  useEffect(() => {
    if (conversation) {
      const streamMessages = async () => {
        const stream = await conversation.streamMessages();
        for await (const msg of stream) {
          setMessages(prevMessages => [...prevMessages, msg]);
        }
      };
      streamMessages();
    }
  }, [conversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && conversation) {
      await sendMessage(conversation, userInput);
      setUserInput('');
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={onClose} className={styles.closeButton}>Close</button>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.senderAddress === user?.address ? styles.user : styles.agent}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here..."
          className={styles.input}
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
}