import { useState } from 'react'
import styles from './UserProfile.module.css'
import KintoVerification from './KintoVerification'

export default function UserProfile() {
  const [username, setUsername] = useState('Aysi')

  return (
    <div className={styles.userProfile}>
      <div className={styles.avatar}>👤</div>
      <div className={styles.userDetails}>
        <div className={styles.username}>{username}</div>
        <KintoVerification />
      </div>
    </div>
  )
}