import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import styles from './UserProfile.module.css'
import KintoVerification from './KintoVerification'

export default function UserProfile() {
  const { user } = useAuth()
  const [username, setUsername] = useState(user?.address)

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