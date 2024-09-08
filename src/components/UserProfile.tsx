import React from 'react'
import styles from '../styles/UserProfile.module.css'
import KintoVerification from './KintoVerification'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'

export default function UserProfile() {
  const { address } = useWeb3Auth();
  const username = address ? `${address?.substring(0, 4)}...${address?.substring(address.length - 4)}` : 'Unknown';

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