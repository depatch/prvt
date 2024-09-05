import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useStackr } from '@/hooks/useStackr'

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  endTime: number;
}

export function ClubPolls({ clubId }: { clubId: string }) {
  const [polls, setPolls] = useState<Poll[]>([])
  const [newPollQuestion, setNewPollQuestion] = useState('')
  const [newPollOptions, setNewPollOptions] = useState(['', ''])
  const { address } = useWeb3Auth()
  const { incrementPoints, checkAndAwardAchievements } = useStackr()

  useEffect(() => {
    // TODO: Fetch existing polls from backend or Stackr
    // This is a placeholder implementation
    setPolls([
      {
        id: '1',
        question: 'What should be our next club event?',
        options: [
          { id: '1a', text: 'NFT showcase', votes: 5 },
          { id: '1b', text: 'DeFi workshop', votes: 3 },
          { id: '1c', text: 'Web3 gaming night', votes: 7 },
        ],
        createdBy: '0x1234...5678',
        endTime: Date.now() + 86400000, // 24 hours from now
      },
    ])
  }, [clubId])

  const handleCreatePoll = async () => {
    if (newPollQuestion && newPollOptions.every(option => option.trim() !== '')) {
      const newPoll: Poll = {
        id: Date.now().toString(),
        question: newPollQuestion,
        options: newPollOptions.map((option, index) => ({
          id: `${Date.now()}-${index}`,
          text: option,
          votes: 0,
        })),
        createdBy: address || '',
        endTime: Date.now() + 86400000, // 24 hours from now
      }
      setPolls([...polls, newPoll])
      setNewPollQuestion('')
      setNewPollOptions(['', ''])
      await incrementPoints(address || '', 10, 'created_poll')
      await checkAndAwardAchievements(address || '')
    }
  }

  const handleVote = async (pollId: string, optionId: string) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 }
            }
            return option
          }),
        }
      }
      return poll
    }))
    await incrementPoints(address || '', 5, 'voted_in_poll')
    await checkAndAwardAchievements(address || '')
  }

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">Club Polls</h3>
      {polls.map(poll => (
        <div key={poll.id} className="mb-4 p-2 bg-secondary rounded">
          <h4 className="font-bold">{poll.question}</h4>
          <p className="text-sm text-muted-foreground">Created by: {poll.createdBy.slice(0, 6)}...{poll.createdBy.slice(-4)}</p>
          <p className="text-sm text-muted-foreground">Ends: {new Date(poll.endTime).toLocaleString()}</p>
          {poll.options.map(option => (
            <div key={option.id} className="flex justify-between items-center mt-2">
              <span>{option.text}</span>
              <Button onClick={() => handleVote(poll.id, option.id)} size="sm">Vote ({option.votes})</Button>
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4">
        <h4 className="font-bold mb-2">Create New Poll</h4>
        <Input
          placeholder="Poll question"
          value={newPollQuestion}
          onChange={(e) => setNewPollQuestion(e.target.value)}
          className="mb-2"
        />
        {newPollOptions.map((option, index) => (
          <Input
            key={index}
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...newPollOptions]
              newOptions[index] = e.target.value
              setNewPollOptions(newOptions)
            }}
            className="mb-2"
          />
        ))}
        <Button onClick={() => setNewPollOptions([...newPollOptions, ''])}>Add Option</Button>
        <Button onClick={handleCreatePoll} className="ml-2">Create Poll</Button>
      </div>
    </div>
  )
}