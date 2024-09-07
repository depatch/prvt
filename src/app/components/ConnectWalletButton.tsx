'use client'

import { useState } from 'react'
import { useWeb3Auth } from '../hooks/useWeb3Auth'
import { useAuth } from '../context/AuthContext'
import styles from './ConnectWalletButton.module.css'

export default function ConnectWalletButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { connect, disconnect } = useWeb3Auth()
  const { authState, updateAuthState } = useAuth()

  const handleClick = async () => {
    setIsLoading(true)
    try {
      if (authState.isConnected) {
        await disconnect()
        updateAuthState(false, null)
      } else {
        const result = await connect()
        if (result && result.address) {
          updateAuthState(true, result.address)
        }
      }
    } catch (error) {
      console.error('Connection error:', error)
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
        ? 'Loading...'
        : authState.isConnected
        ? `Disconnect ${authState.address?.slice(0, 6)}...${authState.address?.slice(-4)}` 
        : 'Connect Wallet'}
    </button>
  )
}