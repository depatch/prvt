import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { fetchNFTs } from '@/utils/nftFetcher'
import { SignSDK } from '@signprotocol/sdk'
import { XMTPSubscribeButton } from '@/components/XMTPSubscribeButton'
import { ClubActivities } from '@/components/ClubActivities'
import { ClubSharing } from '@/components/ClubSharing'
import { useXMTP } from '@/hooks/useXMTP'
import { ClubChat } from '@/components/ClubChat'

interface EntryQuestion {
    id: number;
    question: string;
}

interface MembershipApplication {
  id: string;
  applicant: string;
  answers: string[];
  votes: { [memberAddress: string]: boolean };
}

export function ClubCreatorAgent() {
    const [isActive, setIsActive] = useState(false)
    const [clubName, setClubName] = useState('')
    const [clubDescription, setClubDescription] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [nftCollections, setNftCollections] = useState<any[]>([])
    const [selectedCollection, setSelectedCollection] = useState('')
    const [entryQuestions, setEntryQuestions] = useState<EntryQuestion[]>([])
    const [newQuestion, setNewQuestion] = useState('')
    const [isCreatingAttestation, setIsCreatingAttestation] = useState(false)
    const { address, provider } = useWeb3Auth()
    const [clubAddress, setClubAddress] = useState<string | null>(null);
    const [membershipApplications, setMembershipApplications] = useState<MembershipApplication[]>([])
    const { client } = useXMTP(useWeb3Auth().wallet)

    useEffect(() => {
        async function loadNFTCollections() {
            if (address) {
                const userNFTs = await fetchNFTs(address)
                const collections = userNFTs.reduce((acc, nft) => {
                    if (!acc.find(c => c.address === nft.contractAddress)) {
                        acc.push({ address: nft.contractAddress, name: nft.collectionName })
                    }
                    return acc
                }, [])
                setNftCollections(collections)
            }
        }

        loadNFTCollections()
    }, [address])

    const handleActivate = () => {
        setIsActive(!isActive)
        // TODO: Implement actual AI agent activation logic
        if (!isActive) {
            // Simulating AI suggestions
            setSuggestions([
                'NFT Collectors Club',
                'DeFi Enthusiasts',
                'Blockchain Developers Network'
            ])
        } else {
            setSuggestions([])
        }
    }

    const handleCreateClub = async () => {
        if (!clubName || !clubDescription || !selectedCollection) {
            alert('Please fill in all required fields')
            return
        }

        setIsCreatingAttestation(true)

        try {
            // Create club
            // TODO: Implement actual club creation logic (e.g., storing club data on-chain or in a database)
            console.log('Creating club:', { 
                name: clubName, 
                description: clubDescription,
                nftGate: selectedCollection,
                entryQuestions 
            })

            // Simulate club address creation (replace with actual logic)
            const simulatedClubAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
            setClubAddress(simulatedClubAddress);

            // Create attestation
            const signSDK = new SignSDK(provider)
            const attestation = await signSDK.createAttestation({
                schema: 'club-creator',
                recipient: address,
                expirationTime: Math.floor(Date.now() / 1000) + 31536000, // 1 year from now
                data: {
                    clubName,
                    clubDescription,
                    nftGate: selectedCollection,
                    createdAt: new Date().toISOString(),
                    clubAddress: simulatedClubAddress,
                },
            })

            console.log('Club creator attestation created:', attestation)

            alert('Club created successfully and attestation issued!')
        } catch (error) {
            console.error('Error creating club or attestation:', error)
            alert('Failed to create club or issue attestation. Please try again.')
        } finally {
            setIsCreatingAttestation(false)
        }
    }

    const addEntryQuestion = () => {
        if (newQuestion.trim()) {
            setEntryQuestions([...entryQuestions, { id: Date.now(), question: newQuestion.trim() }])
            setNewQuestion('')
        }
    }

    const removeEntryQuestion = (id: number) => {
        setEntryQuestions(entryQuestions.filter(q => q.id !== id))
    }

    const createMembershipAttestation = async (memberAddress: string) => {
        try {
            const signSDK = new SignSDK(provider)
            const attestation = await signSDK.createAttestation({
                schema: 'club-membership',
                recipient: memberAddress,
                expirationTime: Math.floor(Date.now() / 1000) + 31536000, // 1 year from now
                data: {
                    clubName,
                    clubAddress,
                    joinedAt: new Date().toISOString(),
                },
            })

            console.log('Club membership attestation created:', attestation)
            return attestation
        } catch (error) {
            console.error('Error creating membership attestation:', error)
            throw error
        }
    }

    const handleJoinRequest = async (application: MembershipApplication) => {
        setMembershipApplications([...membershipApplications, application])
        
        // Notify club members about new application
        if (client && clubAddress) {
            const conversation = await client.conversations.newConversation(clubAddress)
            await conversation.send(`New membership application from ${application.applicant}. Please vote!`)
        }
    }

    const handleVote = async (applicationId: string, voterAddress: string, vote: boolean) => {
        const updatedApplications = membershipApplications.map(app => {
            if (app.id === applicationId) {
                return { ...app, votes: { ...app.votes, [voterAddress]: vote } }
            }
            return app
        })
        setMembershipApplications(updatedApplications)

        // Check if the application has received enough votes
        const application = updatedApplications.find(app => app.id === applicationId)
        if (application) {
            const totalVotes = Object.values(application.votes).length
            const positiveVotes = Object.values(application.votes).filter(v => v).length
            const votingThreshold = Math.ceil(totalVotes / 2) // Simple majority

            if (positiveVotes >= votingThreshold) {
                await approveApplication(application)
            } else if (totalVotes - positiveVotes > votingThreshold) {
                await rejectApplication(application)
            }
        }
    }

    const approveApplication = async (application: MembershipApplication) => {
        try {
            const attestation = await createMembershipAttestation(application.applicant)
            console.log('Membership attestation created:', attestation)

            // Notify the applicant
            if (client) {
                const conversation = await client.conversations.newConversation(application.applicant)
                await conversation.send(`NOTIFICATION:Your application to join ${clubName} has been approved!`)
            }

            // Remove the application from the list
            setMembershipApplications(membershipApplications.filter(app => app.id !== application.id))
        } catch (error) {
            console.error('Error approving application:', error)
        }
    }

    const rejectApplication = async (application: MembershipApplication) => {
        // Notify the applicant
        if (client) {
            const conversation = await client.conversations.newConversation(application.applicant)
            await conversation.send(`NOTIFICATION:Your application to join ${clubName} has been rejected.`)
        }

        // Remove the application from the list
        setMembershipApplications(membershipApplications.filter(app => app.id !== application.id))
    }

    return (
        <div className="bg-card p-4 rounded">
            <h3 className="font-bold mb-2">Club Creator Agent</h3>
            <p className="text-sm text-muted-foreground mb-4">Assists in creating and managing new clubs</p>
            <Button onClick={handleActivate} variant={isActive ? "secondary" : "default"}>
                {isActive ? 'Deactivate' : 'Activate'}
            </Button>
            {isActive && (
                <div className="mt-4">
                    <Input
                        placeholder="Club Name"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        className="mb-2"
                    />
                    <Textarea
                        placeholder="Club Description"
                        value={clubDescription}
                        onChange={(e) => setClubDescription(e.target.value)}
                        className="mb-2"
                    />
                    <select
                        value={selectedCollection}
                        onChange={(e) => setSelectedCollection(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                    >
                        <option value="">Select NFT Collection for Membership</option>
                        {nftCollections.map((collection) => (
                            <option key={collection.address} value={collection.address}>
                                {collection.name}
                            </option>
                        ))}
                    </select>
                    <div className="mb-2">
                        <h4 className="font-bold mb-1">Entry Questions</h4>
                        {entryQuestions.map((q) => (
                            <div key={q.id} className="flex items-center mb-1">
                                <p className="flex-grow">{q.question}</p>
                                <Button onClick={() => removeEntryQuestion(q.id)} variant="destructive" size="sm">Remove</Button>
                            </div>
                        ))}
                        <div className="flex items-center">
                            <Input
                                placeholder="New entry question"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                className="flex-grow mr-2"
                            />
                            <Button onClick={addEntryQuestion}>Add</Button>
                        </div>
                    </div>
                    {suggestions.length > 0 && (
                        <div className="mb-2">
                            <p className="font-bold">Suggestions:</p>
                            <ul>
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} className="cursor-pointer hover:text-primary" onClick={() => setClubName(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button 
                        onClick={handleCreateClub} 
                        disabled={isCreatingAttestation}
                    >
                        {isCreatingAttestation ? 'Creating Club...' : 'Create Club'}
                    </Button>
                </div>
            )}
            {clubAddress && (
                <>
                    <div className="mt-4">
                        <h4 className="font-bold mb-2">Club Subscription</h4>
                        <XMTPSubscribeButton 
                            broadcastAddress={clubAddress} 
                            broadcastName={clubName} 
                        />
                    </div>
                    <ClubActivities clubId={clubAddress} />
                    <ClubSharing clubId={clubAddress} clubName={clubName} />
                    <ClubChat clubId={clubAddress} clubName={clubName} />
                    <div className="mt-4">
                        <h4 className="font-bold mb-2">Membership Applications</h4>
                        {membershipApplications.map(application => (
                            <div key={application.id} className="bg-secondary p-2 rounded mb-2">
                                <p>Applicant: {application.applicant}</p>
                                {application.answers.map((answer, index) => (
                                    <p key={index}>Q{index + 1}: {answer}</p>
                                ))}
                                <div className="mt-2">
                                    <Button onClick={() => handleVote(application.id, address!, true)} className="mr-2">Approve</Button>
                                    <Button onClick={() => handleVote(application.id, address!, false)} variant="destructive">Reject</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}