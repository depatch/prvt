import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Updated import
import { Web3AuthNoModal } from "@web3auth/no-modal"
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, IProvider } from "@web3auth/base"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { ethers } from 'ethers'

const clientId = "NEXT_PUBLIC_WEB3AUTH_CLIENT_ID"

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
}

export default function ConnectWallet() {
    const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null)
    const [provider, setProvider] = useState<IProvider | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [address, setAddress] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (typeof window === 'undefined') return

        const init = async () => {
            try {
                const web3auth = new Web3AuthNoModal({
                    clientId,
                    web3AuthNetwork: "mainnet",
                    chainConfig,
                })

                const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } })

                const openloginAdapter = new OpenloginAdapter({
                    privateKeyProvider,
                })
                web3auth.configureAdapter(openloginAdapter)

                setWeb3auth(web3auth)
                await web3auth.init()

                if (web3auth.connected) {
                    setIsConnected(true)
                    const address = await getAddress(web3auth.provider!)
                    setAddress(address)
                    setProvider(web3auth.provider)
                    window.localStorage.setItem('provider', JSON.stringify(web3auth.provider))
                }
            } catch (error) {
                console.error(error)
            }
        }

        init()
    }, [])

    const connect = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet")
            return
        }
        const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: "google",
        })
        setProvider(web3authProvider)
        setIsConnected(true)
        const address = await getAddress(web3authProvider!)
        setAddress(address)
        window.localStorage.setItem('provider', JSON.stringify(web3authProvider))
        router.push('/app')
    }

    const disconnect = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet")
            return
        }
        await web3auth.logout()
        setProvider(null)
        setIsConnected(false)
        setAddress(null)
        window.localStorage.removeItem('provider')
    }

    const getAddress = async (provider: IProvider): Promise<string> => {
        const ethersProvider = new ethers.BrowserProvider(provider as any)
        const signer = await ethersProvider.getSigner()
        const address = await signer.getAddress()
        return address
    }

    if (typeof window === 'undefined') return null

    return (
        <div>
            {!isConnected ? (
                <button
                    onClick={connect}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="flex items-center">
                    <span className="mr-4 text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    <button
                        onClick={disconnect}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    )
}