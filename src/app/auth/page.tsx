'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/auth.module.css'

export default function Auth() {
  const [authError, setAuthError] = useState('')
  const { isConnected, address, login, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isConnected && address) {
      router.push('/home')
    }
  }, [isConnected, address, router])

  const handleAuth = async () => {
    setAuthError('');
    try {
      await login();
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('Failed to authenticate. Please try again.');
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container} style={{
      padding: 'var(--spacing-32, 32px) var(--spacing-120, 120px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px'
    }}>
      <h1 className={styles.title}>Welcome to PRVT Chat App</h1>
      <p className={styles.description}>
        Connect your wallet to start chatting securely.
      </p>
      <button onClick={handleAuth} className={styles.authButton}>
        Connect Wallet
      </button>
      {authError && <p className={styles.error}>{authError}</p>}
    </div>
  )
}