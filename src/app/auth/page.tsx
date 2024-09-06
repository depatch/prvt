'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useWeb3Auth from '../hooks/useWeb3Auth'
import styles from './auth.module.css'

export default function Auth() {
  const [authError, setAuthError] = useState('')
  const { connect, isConnected, isLoading } = useWeb3Auth()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push('/complete-profile')
    }
  }, [isConnected, router])

  const handleAuth = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Authentication error:', error)
      setAuthError('Failed to authenticate. Please try again.')
    }
  }

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Authenticate with Web3</h1>
      <p className={styles.description}>
        Connect your wallet or use social login to access PRVT Chat App
      </p>
      <button 
        className={styles.authButton} 
        onClick={handleAuth}
        disabled={isConnected}
      >
        {isConnected ? 'Connected' : 'Authenticate'}
      </button>
      {authError && <p className={styles.error}>{authError}</p>}
    </div>
  )
}