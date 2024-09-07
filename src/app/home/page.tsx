'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import ConnectWalletButton from '../components/ConnectWalletButton'
import styles from './home.module.css'

export default function Home() {
  const { authState } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authState.isConnected) {
      router.push('/auth')
    }
  }, [authState, router])

  if (!authState.isConnected) {
    return <div className={styles.container}>Redirecting to authentication...</div>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to PRVT Chat App</h1>
      <p className={styles.description}>
        You're now connected with address: {authState.address}
      </p>
      <ConnectWalletButton />
      {/* Add more content for the home page */}
    </div>
  )
}