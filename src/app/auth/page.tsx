'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWeb3Auth } from '../hooks/useWeb3Auth'
import { useAuth } from '../context/AuthContext'
import styles from './auth.module.css'

export default function Auth() {
  const [authError, setAuthError] = useState('')
  const { connect } = useWeb3Auth()
  const { authState, updateAuthState } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authState.isConnected && authState.address) {
      router.push('/home')
    }
  }, [authState, router])

  const handleAuth = async () => {
    setAuthError('');
    try {
      const result = await connect();
      if (result && result.address) {
        updateAuthState(true, result.address);
        router.push('/home');
      } else {
        setAuthError('Failed to authenticate. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('Failed to authenticate. Please try again.');
    }
  }

  return (
    <div className={styles.container}>
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