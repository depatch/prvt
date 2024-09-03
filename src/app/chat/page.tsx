'use client'

import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{sender: string, content: string}>>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'You', content: newMessage }]);
      setNewMessage('');
      // Here you would typically send the message to your backend or XMTP
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 mr-2"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}