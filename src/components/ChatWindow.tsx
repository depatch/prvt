import { useState, useEffect } from 'react'
import { useXmtp } from '../hooks/useXMTP'
import MessageInput from './MessageInput'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  conversation: any;
  provider: any;
}

export default function ChatWindow({ conversation, provider }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([])
  const { xmtpClient } = useXmtp(provider)

  useEffect(() => {
    const loadMessages = async () => {
      if (conversation) {
        const history = await conversation.messages()
        setMessages(history)
      }
    }
    loadMessages()

    const streamMessages = async () => {
      const stream = await conversation.streamMessages()
      for await (const message of stream) {
        setMessages((prevMessages) => [...prevMessages, message])
      }
    }
    streamMessages()
  }, [conversation])

  const handleSendMessage = async (content: string) => {
    if (conversation && content.trim()) {
      await conversation.send(content)
    }
  }

  if (!conversation) {
    return <div className={styles.noChatSelected}>Select a conversation to start chatting</div>
  }

  console.log(conversation)

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <h2>Chat with {conversation.peerAddress.slice(0, 6)}...{conversation.peerAddress.slice(-4)}</h2>
      </div>
      <div className={styles.messageList}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${xmtpClient && message.senderAddress === xmtpClient.address ? styles.sent : styles.received}`}>
            {message.content}
          </div>
        ))}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}