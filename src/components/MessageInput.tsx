import { useState } from 'react'
import styles from '../styles/MessageInput.module.css'

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <div className={styles.messageInputWrapper}>
      <div className={styles.messageInput}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}