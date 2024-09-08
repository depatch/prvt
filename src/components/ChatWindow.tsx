import { useState, useEffect, useRef } from 'react'
import { useXmtp } from '../hooks/useXMTP'
import MessageInput from './MessageInput'
import styles from '../styles/ChatWindow.module.css'

interface ChatWindowProps {
  conversation: any;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([])
  const { xmtpClient } = useXmtp()
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      if (conversation) {
        const history = await conversation.messages()
        if (isMounted) setMessages(history)

        const streamMessages = async () => {
          const stream = await conversation.streamMessages()
          for await (const message of stream) {
            if (isMounted) setMessages((prevMessages) => [...prevMessages, message])
          }
        }
        streamMessages()
      }
    }
    loadMessages()

    return () => {
      isMounted = false;
    }
  }, [conversation])

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (conversation && content.trim()) {
      await conversation.send(content)
    }
  }

  if (!conversation) {
    return <div className={styles.noChatSelected}>Select a conversation to start chatting</div>
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <h2>Chat with {conversation.peerAddress.slice(0, 6)}...{conversation.peerAddress.slice(-4)}</h2>
      </div>
      <div className={styles.messageListWrapper} ref={messageListRef}>
        <div className={styles.messageList}>
          {messages.map((message, index) => (
            <div key={index} className={`${styles.message} ${xmtpClient && message.senderAddress === xmtpClient.address ? styles.sent : styles.received}`}>
              <div className={styles.messageContent}>{message.content}</div>
              <div className={styles.messageTime}>{new Date(message.sent).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}