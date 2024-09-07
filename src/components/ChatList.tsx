import styles from './ChatList.module.css'

export default function ChatList({ setActiveChat }: { setActiveChat: (chat: any) => void }) {
  return (
    <div className={styles.chatList}>
      <div className={styles.header}>
        <h2>Chats</h2>
        <button className={styles.newChat}>+ Create new message</button>
      </div>
      <div className={styles.emptyState}>
        You don't have any chats
      </div>
    </div>
  )
}