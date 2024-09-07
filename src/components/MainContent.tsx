import styles from './MainContent.module.css'
import Features from './Features'
import MessageInput from './MessageInput'

export default function MainContent({ activeChat }: { activeChat: any }) {
  return (
    <div className={styles.mainContent}>
      {activeChat ? (
        <div className={styles.chat}>
          {/* Implement chat UI here */}
        </div>
      ) : (
        <Features />
      )}
      <MessageInput />
    </div>
  )
}