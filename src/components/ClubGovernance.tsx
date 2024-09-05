import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useStackr } from '@/hooks/useStackr'

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  votes: {
    for: string[];
    against: string[];
  };
  status: 'active' | 'passed' | 'rejected';
  endTime: number;
}

export function ClubGovernance({ clubId }: { clubId: string }) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [newProposalTitle, setNewProposalTitle] = useState('')
  const [newProposalDescription, setNewProposalDescription] = useState('')
  const { address } = useWeb3Auth()
  const { incrementPoints, checkAndAwardAchievements } = useStackr()

  useEffect(() => {
    // TODO: Fetch existing proposals from backend or Stackr
    // This is a placeholder implementation
    setProposals([
      {
        id: '1',
        title: 'Change club logo',
        description: 'Proposal to update our club logo to a more modern design.',
        proposedBy: '0x1234...5678',
        votes: {
          for: ['0x1234...5678', '0x5678...9012'],
          against: ['0x9012...3456'],
        },
        status: 'active',
        endTime: Date.now() + 604800000, // 7 days from now
      },
    ])
  }, [clubId])

  const handleCreateProposal = async () => {
    if (newProposalTitle && newProposalDescription) {
      const newProposal: Proposal = {
        id: Date.now().toString(),
        title: newProposalTitle,
        description: newProposalDescription,
        proposedBy: address || '',
        votes: {
          for: [],
          against: [],
        },
        status: 'active',
        endTime: Date.now() + 604800000, // 7 days from now
      }
      setProposals([...proposals, newProposal])
      setNewProposalTitle('')
      setNewProposalDescription('')
      await incrementPoints(address || '', 30, 'created_proposal')
      await checkAndAwardAchievements(address || '')
    }
  }

  const handleVote = async (proposalId: string, voteType: 'for' | 'against') => {
    setProposals(proposals.map(proposal => {
      if (proposal.id === proposalId && address) {
        const updatedVotes = { ...proposal.votes }
        // Remove the user's vote from both arrays to ensure they only have one vote
        updatedVotes.for = updatedVotes.for.filter(voter => voter !== address)
        updatedVotes.against = updatedVotes.against.filter(voter => voter !== address)
        // Add the user's new vote
        updatedVotes[voteType].push(address)
        return { ...proposal, votes: updatedVotes }
      }
      return proposal
    }))
    await incrementPoints(address || '', 10, 'voted_on_proposal')
    await checkAndAwardAchievements(address || '')
  }

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">Club Governance</h3>
      {proposals.map(proposal => (
        <div key={proposal.id} className="mb-4 p-2 bg-secondary rounded">
          <h4 className="font-bold">{proposal.title}</h4>
          <p className="text-sm">{proposal.description}</p>
          <p className="text-sm text-muted-foreground">
            Proposed by: {proposal.proposedBy.slice(0, 6)}...{proposal.proposedBy.slice(-4)}
          </p>
          <p className="text-sm text-muted-foreground">
            Ends: {new Date(proposal.endTime).toLocaleString()}
          </p>
          <p className="text-sm">Votes For: {proposal.votes.for.length}</p>
          <p className="text-sm">Votes Against: {proposal.votes.against.length}</p>
          <div className="mt-2">
            <Button 
              onClick={() => handleVote(proposal.id, 'for')} 
              size="sm" 
              className="mr-2"
              disabled={address && proposal.votes.for.includes(address)}
            >
              Vote For
            </Button>
            <Button 
              onClick={() => handleVote(proposal.id, 'against')} 
              size="sm"
              disabled={address && proposal.votes.against.includes(address)}
            >
              Vote Against
            </Button>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <h4 className="font-bold mb-2">Create New Proposal</h4>
        <Input
          placeholder="Proposal title"
          value={newProposalTitle}
          onChange={(e) => setNewProposalTitle(e.target.value)}
          className="mb-2"
        />
        <Textarea
          placeholder="Proposal description"
          value={newProposalDescription}
          onChange={(e) => setNewProposalDescription(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleCreateProposal}>Create Proposal</Button>
      </div>
    </div>
  )
}