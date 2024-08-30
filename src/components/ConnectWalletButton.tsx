import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Web3AuthNoModal } from "@web3auth/no-modal"
import { WALLET_ADAPTERS, IProvider, CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { ethers } from 'ethers'

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID // Ensure this is set to the mainnet client ID

const chainConfig = {
    chainNamespace: "eip155",
    chainId: "0x3", // Change this to the appropriate chain ID for sapphire_devnet
    rpcTarget: "https://rpc.sapphire.devnet", // Update this to the correct RPC target for sapphire_devnet
}

const customChainConfig: CustomChainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x3",
    rpcTarget: "https://rpc.sapphire.devnet",
}

export function ConnectWalletButton() {
    const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null)
    const [provider, setProvider] = useState<IProvider | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [address, setAddress] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (typeof window === 'undefined') return

        const init = async () => {
            const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
            if (!clientId) throw new Error("Missing Web3Auth client ID")

            const customChainConfig = {
                chainNamespace: CHAIN_NAMESPACES.EIP155,
                chainId: "0x3",
                rpcTarget: "https://rpc.sapphire.devnet",
            }

            const web3auth = new Web3AuthNoModal({
                clientId,
                web3AuthNetwork: "sapphire_devnet",
                chainConfig: customChainConfig,
            })

            const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig: customChainConfig } })
            web3auth.configureAdapter(new OpenloginAdapter({ privateKeyProvider }))
            await web3auth.init()

            setWeb3auth(web3auth)

            if (web3auth.connected) {
                setIsConnected(true)
                const address = await getAddress(web3auth.provider!)
                setAddress(address)
                setProvider(web3auth.provider)
                window.localStorage.setItem('provider', JSON.stringify(web3auth.provider))
            }
        }

        try {
            init()
        } catch (error) {
            console.error("Error initializing Web3Auth:", error)
        }
    }, [])

    const connect = async () => {
        if (!web3auth) return
        try {
            const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: "google" })
            setProvider(web3authProvider)
            setIsConnected(true)
            const address = await getAddress(web3authProvider!)
            setAddress(address)
            window.localStorage.setItem('provider', JSON.stringify(web3authProvider))
            router.push('/app')
        } catch (error) {
            console.error("Error connecting to wallet:", error)
        }
    }

    const disconnect = async () => {
        if (!web3auth) return
        await web3auth.logout()
        setProvider(null)
        setIsConnected(false)
        setAddress(null)
        window.localStorage.removeItem('provider')
    }

    const getAddress = async (provider: IProvider): Promise<string> => {
        const ethersProvider = new ethers.BrowserProvider(provider as any)
        const signer = await ethersProvider.getSigner()
        return await signer.getAddress()
    }

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