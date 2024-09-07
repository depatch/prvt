import styles from './MessageInput.module.css'

export default function MessageInput() {
  return (
    <div className={styles.messageInput}>
      <input type="text" placeholder="Message Private" />
      <button>Send</button>
    </div>
  )
}