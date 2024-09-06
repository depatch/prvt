'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useWeb3Auth from '../hooks/useWeb3Auth'
import { fetchNFTs } from '../utils/nftFetcher'
import styles from './complete-profile.module.css'

export default function CompleteProfile() {
  const [username, setUsername] = useState('')
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null) // Update type to string | null
  const [nfts, setNfts] = useState<{ id: string; name: string; image: string; }[]>([]) // Specify the type for nfts
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { address, isConnected } = useWeb3Auth()

  useEffect(() => {
    if (!isConnected) {
      router.push('/auth')
    } else if (address) {
      loadNFTs()
    }
  }, [isConnected, address, router])


  async function loadNFTs() {
    setIsLoading(true)
    const userNFTs = await fetchNFTs(address)
    setNfts(userNFTs) // This will now work
    setIsLoading(false) // Ensure to set loading to false after fetching
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !selectedNFT) {
      alert('Please fill in all fields')
      return
    }
    // TODO: Implement profile creation logic here
    console.log('Profile completed:', { username, selectedNFT })
    
    // For now, we'll just redirect to the home page
    router.push('/home')
  }

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Please connect your wallet</h1>
        <button onClick={() => router.push('/auth')} className={styles.button}>
          Go to Authentication
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <div className={styles.container}>Loading your NFTs...</div>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            placeholder="Choose a username"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Select Profile Picture NFT</label>
          <div className={styles.nftGrid}>
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className={`${styles.nftItem} ${selectedNFT === nft.id ? styles.selected : ''}`}
                onClick={() => setSelectedNFT(nft.id)}
              >
                <Image src={nft.image} alt={nft.name} width={100} height={100} className={styles.nftImage} />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className={styles.button}>
          Complete Profile
        </button>
      </form>
    </div>
  )
}
