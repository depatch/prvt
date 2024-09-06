'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useWeb3Auth from '../hooks/useWeb3Auth'
import styles from './home.module.css'

export default function Home() {
  const [username, setUsername] = useState('')
  const { isConnected, address, isLoading } = useWeb3Auth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.push('/auth')
    } else if (isConnected && address) {
      setUsername('User' + address.slice(0, 6))
    }
  }, [isLoading, isConnected, address, router])

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome, {username}!</h1>
      <p className={styles.description}>
        You've successfully logged in to PRVT Chat App. Here you can access your chats, join clubs, and more.
      </p>
      <div className={styles.features}>
        <div className={styles.feature}>
          <h2>Chats</h2>
          <p>Start encrypted conversations with other users.</p>
        </div>
        <div className={styles.feature}>
          <h2>Clubs</h2>
          <p>Join exclusive NFT-gated communities.</p>
        </div>
        <div className={styles.feature}>
          <h2>Games</h2>
          <p>Play and bet on blockchain-based games.</p>
        </div>
      </div>
    </div>
  )
}