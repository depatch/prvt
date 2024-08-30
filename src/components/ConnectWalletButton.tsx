import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Web3AuthNoModal } from "@web3auth/no-modal"
import { WALLET_ADAPTERS, IProvider, CHAIN_NAMESPACES } from "@web3auth/base"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { ethers } from 'ethers'
import { Button } from '@/components/ui/button'

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID

const customChainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x3",
    rpcTarget: "https://rpc.sapphire.devnet",
}

export function ConnectWalletButton() {
    const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null)
    const [provider, setProvider] = useState<IProvider | null>(null)
    const [address, setAddress] = useState<string | null>(null)
    const router = useRouter()

    const init = useCallback(async () => {
        if (!clientId) throw new Error("Missing Web3Auth client ID")

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
            const addr = await getAddress(web3auth.provider!)
            setAddress(addr)
            setProvider(web3auth.provider)
            localStorage.setItem('isConnected', 'true')
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        init().catch(console.error)
    }, [init])

    const connect = async () => {
        if (!web3auth) return
        try {
            const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, { loginProvider: "email_passwordless" })
            setProvider(web3authProvider)
            const addr = await getAddress(web3authProvider!)
            setAddress(addr)
            localStorage.setItem('isConnected', 'true')
            router.push('/home')
        } catch (error) {
            console.error("Error connecting to wallet:", error)
        }
    }

    const disconnect = async () => {
        if (!web3auth) return
        await web3auth.logout()
        setProvider(null)
        setAddress(null)
        localStorage.removeItem('isConnected')
        router.push('/')
    }

    const getAddress = async (provider: IProvider): Promise<string> => {
        const ethersProvider = new ethers.BrowserProvider(provider as any)
        const signer = await ethersProvider.getSigner()
        return await signer.getAddress()
    }

    function formatAddress(addr: string | null): string {
        if (!addr) return 'Connect Wallet'
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    return (
        <Button
            onClick={address ? disconnect : connect}
            variant={address ? "destructive" : "default"}
        >
            {formatAddress(address)}
        </Button>
    )
}