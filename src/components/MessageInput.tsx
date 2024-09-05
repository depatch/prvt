import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PaperclipIcon, SendIcon } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <div className="flex items-center bg-secondary rounded-full p-2">
      <Button className="mr-2">
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      <Input
        placeholder="Message Private"
        className="flex-1 bg-transparent border-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <Button onClick={handleSendMessage}>
        <SendIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}