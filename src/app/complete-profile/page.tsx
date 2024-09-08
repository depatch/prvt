'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import styles from './complete-profile.module.css'

export default function CompleteProfile() {
  const [username, setUsername] = useState('')
  const authState = useAuth(); // Use authState from context
  const router = useRouter()

  useEffect(() => {
    if (!authState.isConnected || !authState.address) {
      router.push('/auth');
    }
  }, [authState, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Profile completed:', { username, address: authState.address })
    router.push('/home')
  }

  if (!authState.isConnected || !authState.address) {
    return <div className={styles.container}>Redirecting to authentication...</div>
  }

  return (
    <div className={styles.container} style={{
      padding: 'var(--spacing-32, 32px) var(--spacing-120, 120px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px'
    }}>
      <h1 className={styles.title}>Complete Your Profile</h1>
      <p className={styles.description}>
        Welcome! Please complete your profile to continue.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            placeholder="Choose a username"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Wallet Address</label>
          <p className={styles.address}>{authState.address}</p>
        </div>
        <button type="submit" className={styles.submitButton}>
          Complete Profile
        </button>
      </form>
    </div>
  )
}
