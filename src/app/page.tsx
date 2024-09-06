import Link from 'next/link'
import ConnectWalletButton from './components/ConnectWalletButton'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to PRVT Chat App</h1>
        <p className={styles.description}>
          Experience secure, blockchain-integrated communication with our cutting-edge platform.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Encrypted Chats</h3>
            <p>End-to-end encrypted messaging for ultimate privacy</p>
          </div>
          <div className={styles.feature}>
            <h3>NFT-Gated Clubs</h3>
            <p>Exclusive communities based on NFT ownership</p>
          </div>
          <div className={styles.feature}>
            <h3>Decentralized Identity</h3>
            <p>Control your data with blockchain-based identity</p>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/auth" className={styles.launchButton}>Launch App</Link>
          <ConnectWalletButton />
        </div>
      </div>
    </main>
  )
}