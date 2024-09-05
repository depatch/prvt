"use client"
import React, { useState, useEffect } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useENS } from '@/hooks/useENS'
import { fetchNFTs } from '@/utils/nftFetcher'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'

interface NFT {
    id: string;
    image: string;
    name: string;
}

export default function CompleteProfile() {
    const [username, setUsername] = useState('')
    const [selectedNFT, setSelectedNFT] = useState<string | null>(null)
    const [nfts, setNfts] = useState<NFT[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { address, isConnected, connect } = useWeb3Auth()
    const { ensName, isPremium } = useENS(address ?? '')

    useEffect(() => {
        async function loadNFTs() {
            if (address && isConnected) {
                setIsLoading(true)
                const userNFTs = await fetchNFTs(address)
                setNfts(userNFTs)
                setIsLoading(false)
            }
        }

        if (isConnected) {
            loadNFTs()
        }
    }, [address, isConnected])

    useEffect(() => {
        if (ensName) {
            setUsername(ensName)
        }
    }, [ensName])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isConnected) {
            alert('Please connect your wallet first')
            return
        }
        if (!username || !selectedNFT) {
            alert('Please fill in all fields')
            return
        }
        // TODO: Implement profile creation logic here
        console.log('Profile completed:', { username, selectedNFT, ensName, isPremium })
        
        localStorage.setItem('isProfileCompleted', 'true')
        router.push('/home')
    }

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-6">Connect Your Wallet</h1>
                    <p className="mb-4">Please connect your wallet to complete your profile.</p>
                    <ConnectWalletButton />
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <div>Loading your NFTs...</div>
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h1>
                {isPremium && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Premium ENS Name Detected!</p>
                        <p>You're eligible for a premium badge.</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1"
                        />
                        {ensName && (
                            <p className="mt-1 text-sm text-gray-500">ENS Name: {ensName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Profile Picture NFT</label>
                        <div className="grid grid-cols-3 gap-4">
                            {nfts.map((nft) => (
                                <div
                                    key={nft.id}
                                    className={`cursor-pointer border-2 rounded-lg p-2 ${selectedNFT === nft.id ? 'border-blue-500' : 'border-gray-200'}`}
                                    onClick={() => setSelectedNFT(nft.id)}
                                >
                                    <Image src={nft.image} alt={nft.name} width={100} height={100} className="rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Complete Profile
                    </Button>
                </form>
            </div>
        </div>
    )
}