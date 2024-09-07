import styles from './UserProfile.module.css'

export default function UserProfile() {
  return (
    <div className={styles.userProfile}>
      <img src="/avatar-placeholder.png" alt="User avatar" className={styles.avatar} />
      <div className={styles.userInfo}>
        <div className={styles.username}>Aysi</div>
        <div className={styles.status}>Non-verified</div>
      </div>
      <button className={styles.connectButton}>Connect Kinto ID</button>
    </div>
  )
}