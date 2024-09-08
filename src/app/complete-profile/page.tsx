'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { useAuth } from '@/context/AuthContext'
import { createProfileAttestation } from '@/utils/createProfileAttestation'
import styles from '@/styles/complete-profile.module.css'
import { fetchNFTs } from '@/utils/nftFetcher'

interface NFT {
  id: string;
  name: string
  image: string
}

export default function CompleteProfile() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [nfts, setNfts] = useState<NFT[]>([])
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const router = useRouter()
  const { user, updateUserProfile, addConnectedWallet } = useAuth()
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false)
  const [nftError, setNftError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.isCompleteProfile) {
      router.push('/home')
    }
  }, [user, router])

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        
        setProvider(provider)
        setIsWalletConnected(true)
        await addConnectedWallet(address)
        fetchUserNFTs(address)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
        alert('Failed to connect wallet. Please try again.')
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet to connect.')
    }
  }

  const fetchUserNFTs = async (address: string) => {
    setIsLoadingNFTs(true);
    setNftError(null);
    try {
      const fetchedNFTs = await fetchNFTs(address);
      setNfts(fetchedNFTs);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      if (error instanceof Error) {
        setNftError(`Failed to fetch NFTs: ${error.message}`);
      } else {
        setNftError('An unknown error occurred while fetching NFTs.');
      }
    } finally {
      setIsLoadingNFTs(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !email || !bio) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const attestation = await createProfileAttestation({
        username,
        email,
        bio,
        selectedNFT: selectedNFT?.id || undefined
      })

      if (provider) {
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        await updateUserProfile({ 
          username, 
          email,
          bio,
          profilePicture: selectedNFT?.id || '',
          isCompleteProfile: true,
          attestationId: attestation.id,
          address
        })
        router.push('/home')
      } else {
        throw new Error('No wallet connected')
      }
    } catch (error) {
      console.error('Failed to complete profile:', error)
      alert('Failed to complete profile. Please try again.')
    }
  }

  const handleNFTSelect = (nft: NFT) => {
    console.log('Selecting NFT:', nft); // Add this log
    setSelectedNFT(prevSelected => prevSelected?.id === nft.id ? null : nft);
  }

  const isFormValid = username && email && bio && selectedNFT

  if (!user) {
    return null
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
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
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio" className={styles.label}>Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={styles.input}
            placeholder="Tell us about yourself"
            required
          />
        </div>
        {!isWalletConnected && (
          <div className={styles.walletSection}>
            <p>Connect your wallet to use an NFT as your profile picture</p>
            <button type="button" onClick={connectWallet} className={styles.connectButton}>
              Connect Wallet
            </button>
            <p>Or continue without connecting</p>
          </div>
        )}
        {isWalletConnected && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Select an NFT for your profile picture</label>
            {isLoadingNFTs ? (
              <p className={styles.loadingText}>Loading your NFTs...</p>
            ) : nftError ? (
              <p className={styles.error}>{nftError}</p>
            ) : nfts.length > 0 ? (
              <>
                <div className={styles.nftGrid}>
                  {nfts.map((nft) => (
                    <div
                      key={nft.id}
                      className={`${styles.nftItem} ${selectedNFT?.id === nft.id ? styles.selected : ''}`}
                      onClick={() => handleNFTSelect(nft)}
                    >
                      <div className={styles.nftImageContainer}>
                        <img src={nft.image} alt={nft.name} className={styles.nftImage} />
                      </div>
                      <p className={styles.nftName}>{nft.name}</p>
                    </div>
                  ))}
                </div>
                {selectedNFT && (
                  <div className={styles.selectedNFT}>
                    <p>Selected NFT: {selectedNFT.name}</p>
                  </div>
                )}
              </>
            ) : (
              <p className={styles.noNftsText}>No NFTs found for this wallet.</p>
            )}
          </div>
        )}
        <button 
          type="submit" 
          className={`${styles.submitButton} ${!isFormValid ? styles.disabled : ''}`}
          disabled={!isFormValid}
        >
          Complete Profile
        </button>
      </form>
    </div>
  )
}