import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useChiliz } from '@/hooks/useChiliz'
import { useLitProtocol } from '@/hooks/useLitProtocol'
import { ethers } from 'ethers'
import { Loader2 } from 'lucide-react'

interface SportEvent {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  outcomes: { [key: string]: number };
  totalStaked: number;
}

interface Bet {
  eventId: string;
  outcome: string;
  amount: number;
}

export function SportsBetting() {
  const [events, setEvents] = useState<SportEvent[]>([])
  const [userBets, setUserBets] = useState<Bet[]>([])
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null)
  const [selectedOutcome, setSelectedOutcome] = useState<string>('')
  const [betAmount, setBetAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, provider } = useWeb3Auth()
  const { getBalance, stake, unstake, placeBet } = useChiliz()
  const { encryptBet, decryptBet } = useLitProtocol()
  const [balance, setBalance] = useState<string>('0')

  useEffect(() => {
    // TODO: Fetch real events from a sports API or backend
    setEvents([
      {
        id: '1',
        name: 'UEFA Champions League Final',
        description: 'Manchester City vs Inter Milan',
        startTime: new Date('2023-06-10T19:00:00Z'),
        endTime: new Date('2023-06-10T22:00:00Z'),
        outcomes: { 'Manchester City': 1.5, 'Draw': 3.5, 'Inter Milan': 6.0 },
        totalStaked: 100000,
      },
      // Add more events...
    ])
  }, [])

  useEffect(() => {
    // TODO: Fetch user's bets from the blockchain or backend
    if (address) {
      setUserBets([
        { eventId: '1', outcome: 'Manchester City', amount: 100 },
        // Add more user bets...
      ])
    }
  }, [address])

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        const userBalance = await getBalance(address)
        setBalance(userBalance)
      }
    }
    fetchBalance()
  }, [address, getBalance])

  const handlePlaceBet = async () => {
    if (!selectedEvent || !selectedOutcome || betAmount <= 0) {
      setError('Please select an event, outcome, and enter a valid bet amount.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const bet = { eventId: selectedEvent.id, outcome: selectedOutcome, amount: betAmount };
      
      const accessControlConditions = [
        {
          contractAddress: '',
          standardContractType: '',
          chain: 'chiliz',
          method: 'eth_getBalance',
          parameters: [':userAddress', 'latest'],
          returnValueTest: {
            comparator: '>=',
            value: ethers.utils.parseEther(betAmount.toString()).toString(),
          },
        },
      ];

      const { encryptedBet, encryptedSymmetricKey } = await encryptBet(bet, accessControlConditions);

      // Place the bet on the Chiliz blockchain
      const txHash = await placeBet(selectedEvent.id, encryptedBet, encryptedSymmetricKey);

      setUserBets([...userBets, bet]);
      
      // Reset form
      setSelectedEvent(null);
      setSelectedOutcome('');
      setBetAmount(0);

      console.log('Bet placed successfully. Transaction hash:', txHash);
      
      // Refresh balance after placing bet
      await fetchBalance();
    } catch (error) {
      console.error('Error placing bet:', error);
      setError('Failed to place bet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveBet = async (encryptedBet: string, encryptedSymmetricKey: string) => {
    try {
      const accessControlConditions = [
        {
          contractAddress: '',
          standardContractType: '',
          chain: 'chiliz',
          method: 'eth_getBalance',
          parameters: [':userAddress', 'latest'],
          returnValueTest: {
            comparator: '>=',
            value: '0',
          },
        },
      ];

      const decryptedBet = await decryptBet(encryptedBet, encryptedSymmetricKey, accessControlConditions);
      console.log('Resolved bet:', decryptedBet);
      // TODO: Implement bet resolution logic
    } catch (error) {
      console.error('Error resolving bet:', error);
      setError('Failed to resolve bet. Please try again.');
    }
  };

  return (
    <div className="bg-card p-4 rounded">
      <h2 className="text-2xl font-bold mb-4">Sports Betting</h2>
      <p className="mb-4">Your CHZ Balance: {balance}</p>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Upcoming Events</h3>
        {events.map(event => (
          <div key={event.id} className="mb-2 p-2 bg-secondary rounded">
            <h4 className="font-bold">{event.name}</h4>
            <p>{event.description}</p>
            <p>Start: {event.startTime.toLocaleString()}</p>
            <p>Total Staked: {event.totalStaked} CHZ</p>
            <Button onClick={() => setSelectedEvent(event)}>Place Bet</Button>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Place Bet</h3>
          <p>Event: {selectedEvent.name}</p>
          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Select Outcome</option>
            {Object.entries(selectedEvent.outcomes).map(([outcome, odds]) => (
              <option key={outcome} value={outcome}>{outcome} (Odds: {odds})</option>
            ))}
          </select>
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            placeholder="Bet Amount (CHZ)"
            className="mb-2"
          />
          <Button onClick={handlePlaceBet} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Placing Bet...' : 'Confirm Bet'}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold mb-2">Your Bets</h3>
        {userBets.map((bet, index) => (
          <div key={index} className="mb-2 p-2 bg-secondary rounded">
            <p>Event ID: {bet.eventId}</p>
            <p>Outcome: {bet.outcome}</p>
            <p>Amount: {bet.amount} CHZ</p>
          </div>
        ))}
      </div>
    </div>
  )
}