import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>○ Private</div>
      <div className={styles.userInfo}>
        <span>aysipixie.eth</span>
        {/* Add user avatar and dropdown here */}
      </div>
    </header>
  )
}