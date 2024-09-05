import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { fetchNFTs } from '@/utils/nftFetcher'
import { SignSDK } from '@signprotocol/sdk'
import { useXMTP } from '@/hooks/useXMTP'

interface Club {
  id: string;
  name: string;
  description: string;
  nftRequirement: string;
  entryQuestions: string[];
}

export function ClubFinderAgent() {
  const [isActive, setIsActive] = useState(false)
  const [userInterests, setUserInterests] = useState('')
  const [recommendedClubs, setRecommendedClubs] = useState<Club[]>([])
  const [userNFTs, setUserNFTs] = useState<any[]>([])
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const { address, provider } = useWeb3Auth()
  const { client } = useXMTP(useWeb3Auth().wallet)

  useEffect(() => {
    if (address) {
      fetchNFTs(address).then(nfts => setUserNFTs(nfts))
    }
  }, [address])

  const handleActivate = () => {
    setIsActive(!isActive)
    if (!isActive) {
      findClubs()
    } else {
      setRecommendedClubs([])
    }
  }

  const findClubs = async () => {
    // TODO: Implement actual club finding logic
    // This is a placeholder implementation
    const mockClubs: Club[] = [
      { 
        id: '1', 
        name: 'NFT Enthusiasts', 
        description: 'A club for NFT collectors and creators', 
        nftRequirement: '0x123...',
        entryQuestions: ['What was your first NFT?', 'What do you think about the future of NFTs?']
      },
      { 
        id: '2', 
        name: 'DeFi Explorers', 
        description: 'Discuss the latest in decentralized finance', 
        nftRequirement: '0x456...',
        entryQuestions: ['What's your favorite DeFi protocol?', 'How do you see DeFi evolving in the next 5 years?']
      },
      { 
        id: '3', 
        name: 'Blockchain Developers', 
        description: 'For those building the future of Web3', 
        nftRequirement: '0x789...',
        entryQuestions: ['What programming languages do you use for blockchain development?', 'What's the most interesting smart contract you've written?']
      },
    ]
    setRecommendedClubs(mockClubs)
  }

  const canJoinClub = (club: Club) => {
    return userNFTs.some(nft => nft.contractAddress === club.nftRequirement)
  }

  const handleJoinRequest = async (club: Club) => {
    setSelectedClub(club)
    setAnswers(new Array(club.entryQuestions.length).fill(''))
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmitApplication = async () => {
    if (!selectedClub || !address || !provider) return

    try {
      // Create membership application attestation
      const signSDK = new SignSDK(provider)
      const attestation = await signSDK.createAttestation({
        schema: 'club-membership-application',
        recipient: address,
        expirationTime: Math.floor(Date.now() / 1000) + 604800, // 1 week from now
        data: {
          clubId: selectedClub.id,
          clubName: selectedClub.name,
          applicant: address,
          answers: answers,
          appliedAt: new Date().toISOString(),
        },
      })

      console.log('Club membership application attestation created:', attestation)

      // Send application to the club
      if (client) {
        const conversation = await client.conversations.newConversation(selectedClub.id) // Assuming club.id is the club's address
        await conversation.send(JSON.stringify({
          type: 'membership_application',
          applicant: address,
          answers: answers,
          attestationId: attestation.id,
        }))
      }

      alert('Your application has been submitted successfully!')
      setSelectedClub(null)
      setAnswers([])
    } catch (error) {
      console.error('Error submitting club application:', error)
      alert('Failed to submit application. Please try again.')
    }
  }

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">Club Finder Agent</h3>
      <p className="text-sm text-muted-foreground mb-4">Helps you find clubs based on your interests and NFT holdings</p>
      <Button onClick={handleActivate} variant={isActive ? "secondary" : "default"}>
        {isActive ? 'Deactivate' : 'Activate'}
      </Button>
      {isActive && (
        <div className="mt-4">
          <Input
            placeholder="Enter your interests (e.g., NFTs, DeFi, Gaming)"
            value={userInterests}
            onChange={(e) => setUserInterests(e.target.value)}
            className="mb-2"
          />
          <Button onClick={findClubs}>Find Clubs</Button>
          {recommendedClubs.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">Recommended Clubs:</h4>
              {recommendedClubs.map((club) => (
                <div key={club.id} className="bg-secondary p-2 rounded mb-2">
                  <h5 className="font-bold">{club.name}</h5>
                  <p>{club.description}</p>
                  {canJoinClub(club) ? (
                    <Button size="sm" className="mt-2" onClick={() => handleJoinRequest(club)}>Request to Join</Button>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">You don't have the required NFT to join this club</p>
                  )}
                </div>
              ))}
            </div>
          )}
          {selectedClub && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">Join {selectedClub.name}</h4>
              <p className="mb-2">Please answer the following questions:</p>
              {selectedClub.entryQuestions.map((question, index) => (
                <div key={index} className="mb-2">
                  <p>{question}</p>
                  <Input
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
              <Button onClick={handleSubmitApplication}>Submit Application</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}