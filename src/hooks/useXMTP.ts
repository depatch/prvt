import { useState, useEffect, useCallback } from 'react'
import { Client } from '@xmtp/xmtp-js'
import { ethers } from 'ethers'

export const useXmtp = (isConnected: boolean, address: string | null, provider: any) => {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initXmtp = async () => {
      if (isConnected && provider && address) {
        try {
          setIsLoading(true)
          setError(null)
          
          // Create an ethers provider from the Web3Auth provider
          const ethersProvider = new ethers.BrowserProvider(provider)
          
          // Get the signer
          const signer = await ethersProvider.getSigner()
          
          // Create the XMTP client
          const client = await Client.create(signer)
          setXmtpClient(client) 
        } catch (error) {
          console.error('Error initializing XMTP client:', error)
          setError('Failed to initialize XMTP client. Please try again.')
        } finally {
          setIsLoading(false)
        }
      } else {
        setXmtpClient(null)
        setIsLoading(false)
      }
    }   

    initXmtp()
  }, [isConnected, address, provider])

  const canMessage = useCallback(async (addressToCheck: string): Promise<boolean> => {
    if (!xmtpClient) return false
    return await xmtpClient.canMessage(addressToCheck)
  }, [xmtpClient])

  return { xmtpClient, canMessage, isLoading, error }
}