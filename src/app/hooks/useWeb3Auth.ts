import { ethers } from 'ethers' // Change this line
import { useState, useEffect, useCallback } from 'react'
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES} from '@web3auth/base'
import { JsonRpcProvider } from 'ethers'; // Ensure correct import
import { UserInfo } from '@web3auth/base'; // Use the correct type if available
import { WalletConnectV2Adapter } from '@web3auth/wallet-connect-v2-adapter'; // Update import for v2 adapter

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ''

export default function useWeb3Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<any>(null)
  const [address, setAddress] = useState<string>('')
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x1', // Ethereum mainnet
            rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET || '', // Replace with your actual RPC URL 
          },
          web3AuthNetwork: 'sapphire_mainnet', // Change from 'cyan' to 'sapphire_mainnet'
          privateKeyProvider: new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_TARGET || '') as any, // Cast to any to bypass type checking
        })

        // Add WalletConnect adapter
        const walletConnectAdapter = new WalletConnectV2Adapter({
          adapterSettings: {
            projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
          },
        });
        web3authInstance.configureAdapter(walletConnectAdapter as any); // Cast to any to bypass type checking

        setWeb3auth(web3authInstance)
        await web3authInstance.initModal()

        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider)
          const user = await web3authInstance.getUserInfo() as UserInfo & { publicAddress: string } // Type assertion
          setAddress(user.publicAddress || '')
          setIsConnected(true)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  const connect = useCallback(async () => {
    if (!web3auth) {
      console.log('Web3Auth not initialized')
      return
    }
    try {
      const web3authProvider = await web3auth.connect()
      setProvider(web3authProvider)
      if (web3authProvider) {
        const user = await web3auth.getUserInfo() as UserInfo & { publicAddress: string };
        setAddress(user.publicAddress || '');
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error connecting:', error)
    }
  }, [web3auth])

  const disconnect = useCallback(async () => {
    if (!web3auth) {
      console.log('Web3Auth not initialized')
      return
    }
    await web3auth.logout()
    setProvider(null)
    setAddress('')
    setIsConnected(false)
  }, [web3auth])

  return {
    web3auth,
    provider,
    address,
    isConnected,
    isLoading,
    connect,
    disconnect,
  }
}