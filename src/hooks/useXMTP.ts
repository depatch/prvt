import { useState, useEffect } from 'react'
import { Client } from '@xmtp/xmtp-js'
import { Wallet } from 'ethers'

export const useXmtp = (provider: any) => {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initXmtp = async () => {
      if (provider) {
        try {
          setIsLoading(true)
          setError(null)
          const client = await Client.create(Wallet.createRandom())
          setXmtpClient(client)
        } catch (error) {
          console.error('Error initializing XMTP client:', error)
          setError('Failed to initialize XMTP client. Please try again.')
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
        setError('No provider available. Please connect your wallet.')
      }
    }

    initXmtp()
  }, [provider])

  return { xmtpClient }
}