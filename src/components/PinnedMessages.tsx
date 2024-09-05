import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PinnedMessagesProps {
  messages: Message[];
  onUnpinMessage: (messageId: string) => void;
}

export function PinnedMessages({ messages, onUnpinMessage }: PinnedMessagesProps) {
  return (
    <div className="bg-secondary p-4 rounded mb-4">
      <h3 className="font-bold mb-2">Pinned Messages</h3>
      {messages.map((message) => (
        <div key={message.id} className="flex justify-between items-center mb-2">
          <p className="text-sm">{message.content}</p>
          <Button variant="ghost" size="sm" onClick={() => onUnpinMessage(message.id)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}