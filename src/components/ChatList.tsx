import { useState, useEffect } from 'react'
import { useXmtp } from '../hooks/useXMTP'
import NewConversation from './NewConversation'
import styles from '../styles/ChatList.module.css'

interface ChatListProps {
  setActiveChat: (conversation: any) => void;
}

export default function ChatList({ setActiveChat }: ChatListProps) {
  const [conversations, setConversations] = useState<any[]>([])
  const { xmtpClient } = useXmtp()

  useEffect(() => {
    const loadConversations = async () => {
      if (xmtpClient) {
        const convos = await xmtpClient.conversations.list()
        setConversations(convos)
      }
    }
    loadConversations()
  }, [xmtpClient])

  const handleConversationCreated = (newConversation: any) => {
    setConversations(prevConversations => [...prevConversations, newConversation])
    setActiveChat(newConversation)
  }

  return (
    <div className={styles.chatList}>
      <h2>Chats</h2>
      <NewConversation onConversationCreated={handleConversationCreated}/>
      {conversations.length === 0 ? (
        <div className={styles.emptyState}>
          You don't have any chats yet. Start a new conversation!
        </div>
      ) : (
        <div className={styles.conversations}>
          {conversations.map((conversation) => (
            <div
              key={conversation.peerAddress}
              className={styles.conversationItem}
              onClick={() => setActiveChat(conversation)}
            >
              <div className={styles.peerAddress}>
                {conversation.peerAddress.slice(0, 6)}...{conversation.peerAddress.slice(-4)}
              </div>
              <div className={styles.lastMessage}>
                {/* You might want to fetch and display the last message here */}
                Last message preview...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}