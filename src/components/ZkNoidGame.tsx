import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useStackr } from '@/hooks/useStackr'
import { useMina } from '@/hooks/useMina'

interface GameSession {
  id: string;
  player: string;
  score: number;
  status: 'active' | 'completed';
  bets: { [address: string]: number };
  totalBetAmount: number;
}

export function ZkNoidGame({ clubId }: { clubId: string }) {
  const [isActive, setIsActive] = useState(false)
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [betAmount, setBetAmount] = useState(0)
  const { address } = useWeb3Auth()
  const { incrementPoints, decrementPoints } = useStackr()
  const { isConnected, publicKey, createZkProof } = useMina()

  const activateGame = () => {
    setIsActive(true)
    setCurrentSession({
      id: Date.now().toString(),
      player: address || '',
      score: 0,
      status: 'active',
      bets: {},
      totalBetAmount: 0,
    })
  }

  const placeBet = async () => {
    if (currentSession && address && betAmount > 0) {
      await decrementPoints(address, betAmount, 'placed_bet')
      setCurrentSession(prev => ({
        ...prev!,
        bets: { ...prev!.bets, [address]: (prev!.bets[address] || 0) + betAmount },
        totalBetAmount: prev!.totalBetAmount + betAmount,
      }))
      setBetAmount(0)
    }
  }

  const endGame = async () => {
    if (currentSession && address) {
      setCurrentSession(prev => ({
        ...prev!,
        status: 'completed',
        score: playerScore,
      }))
      await resolveBets()
      setIsActive(false)
    }
  }

  const resolveBets = async () => {
    if (!currentSession) return

    const winningBetAmount = Math.floor(currentSession.totalBetAmount * 0.9) // 10% house fee
    const winningBetValue = Math.floor(winningBetAmount / Object.keys(currentSession.bets).length)

    for (const [bettor, amount] of Object.entries(currentSession.bets)) {
      await incrementPoints(bettor, winningBetValue, 'bet_payout')
    }

    // Award points to the player based on their score
    await incrementPoints(currentSession.player, playerScore, 'game_completed')
  }

  const updateGameState = async (newScore: number) => {
    if (isConnected && createZkProof) {
      const proof = await createZkProof(newScore)
      if (proof) {
        setPlayerScore(newScore)
        // In a real implementation, you'd send this proof to your backend or directly to the blockchain
        console.log('Game state verified with zk-SNARK proof')
      } else {
        console.error('Failed to create zk-SNARK proof')
      }
    } else {
      setPlayerScore(newScore)
    }
  }

  // Simulating game play with zk-SNARK verification
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        updateGameState(playerScore + 10)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isActive, playerScore])

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">zkNoid Game</h3>
      {!isActive ? (
        <Button onClick={activateGame}>Start Game</Button>
      ) : (
        <div>
          <p>Current Score: {playerScore}</p>
          {address === currentSession?.player ? (
            <Button onClick={endGame}>End Game</Button>
          ) : (
            <div>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                placeholder="Enter bet amount"
                className="mr-2"
              />
              <Button onClick={placeBet}>Place Bet</Button>
            </div>
          )}
        </div>
      )}
      {currentSession && (
        <div className="mt-4">
          <h4>Current Bets:</h4>
          {Object.entries(currentSession.bets).map(([better, amount]) => (
            <p key={better}>{better.slice(0, 6)}...{better.slice(-4)}: {amount} points</p>
          ))}
          <p>Total Bet Amount: {currentSession.totalBetAmount} points</p>
        </div>
      )}
    </div>
  )
}