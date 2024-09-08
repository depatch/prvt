import React from 'react'
import styles from '../styles/UserProfile.module.css'
import KintoVerification from './KintoVerification'
import { useAuth } from '@/context/AuthContext'

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.avatar}>
        {user.profilePicture ? (
          <img src={user.profilePicture} alt={user.username} className={styles.avatarImage} />
        ) : (
          <div className={styles.defaultAvatar}>👤</div>
        )}
      </div>
      <div className={styles.userDetails}>
        <div className={styles.username}>{user.username}</div>
        <div className={styles.email}>{user.email}</div>
        <div className={styles.bio}>{user.bio}</div>
        <KintoVerification />
      </div>
    </div>
  )
}