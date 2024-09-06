'use client'

import { useState } from 'react'
import useWeb3Auth from '../hooks/useWeb3Auth'
import styles from './ConnectWalletButton.module.css'

export default function ConnectWalletButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { connect, disconnect, isConnected, address } = useWeb3Auth()

  const handleClick = async () => {
    setIsLoading(true)
    try {
      if (isConnected) {
        await disconnect()
      } else {
        await connect()
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleClick} 
      className={styles.connectButton}
      disabled={isLoading}
    >
      {isLoading
        ? 'Connecting...'
        : isConnected
        ? `Disconnect (${address.slice(0, 6)}...${address.slice(-4)})`
        : 'Connect Wallet'}
    </button>
  )
}