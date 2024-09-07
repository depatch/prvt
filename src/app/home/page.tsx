'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import styles from './home.module.css'

const Header = () => (
  <header className={styles.header}>
    <div className={styles.logo}>○ Private</div>
    <div className={styles.userInfo}>
      <span className={styles.userName}>aysipixie.eth</span>
      <span className={styles.userEmoji}>👤</span>
    </div>
  </header>
)

const UserProfile = () => (
  <div className={styles.userProfile}>
    <div className={styles.avatar}>👤</div>
    <div className={styles.userDetails}>
      <div className={styles.username}>Aysi</div>
      <div className={styles.status}>Non-verified</div>
    </div>
    <button className={styles.connectButton}>Connect Kinto ID</button>
  </div>
)

const AgentButton = ({ type }: { type: 'finder' | 'creator' }) => {
  const emoji = type === 'finder' ? '🔍' : '🎨'
  return (
    <button className={styles.agentButton}>
      <span className={styles.emoji}>{emoji}</span>
      <span>{type === 'finder' ? 'Club finder agent' : 'Club creator agent'}</span>
    </button>
  )
}

const ClubList = () => {
  const clubs = [
    { name: 'Lit Protocol News', owner: 'kalayci.eth', type: 'dev-chat', emoji: '🔥' },
    { name: 'Onchain Daily', owner: 'r3sat.eth', type: 'Magazine', emoji: '📰' },
  ]

  return (
    <div className={styles.clubList}>
      <div className={styles.clubListHeader}>
        <h2>Discover latest clubs</h2>
        <button className={styles.createClub}>+ Create yours</button>
      </div>
      {clubs.map((club, index) => (
        <div key={index} className={styles.club}>
          <div className={styles.clubInfo}>
            <span className={styles.clubEmoji}>{club.emoji}</span>
            <div className={styles.clubDetails}>
              <h3>{club.name}</h3>
              <p>{club.owner}</p>
              <span className={styles.clubType}>{club.type}</span>
            </div>
          </div>
          <button className={styles.joinButton}>Join with NFT</button>
        </div>
      ))}
      <button className={styles.seeAll}>See all →</button>
    </div>
  )
}

const MessageInput = () => (
  <div className={styles.messageInput}>
    <button className={styles.attachButton}>📎</button>
    <input type="text" placeholder="Message Private" />
    <button className={styles.sendButton}>➤</button>
  </div>
)

export default function HomePage() {
  const [activeChat, setActiveChat] = useState(null)
  const { authState } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authState.isConnected) {
      router.push('/auth')
    }
  }, [authState, router])

  if (!authState.isConnected) {
    return <div className={styles.container}>Redirecting to authentication...</div>
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <UserProfile />
          <div className={styles.agentButtons}>
            <AgentButton type="finder" />
            <AgentButton type="creator" />
          </div>
          <ClubList />
        </aside>
        <main className={styles.mainContent}>
          {activeChat ? (
            <div className={styles.chatArea}>
              {/* Chat content would go here */}
              <MessageInput />
            </div>
          ) : (
            <div className={styles.welcomeMessage}>
              <h1>Welcome to PRVT Chat</h1>
              <p>Select a club or start a new conversation</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}