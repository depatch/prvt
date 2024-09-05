import React, { useState, useEffect, useMemo } from 'react'
import { useXMTP } from '@/hooks/useXMTP'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { MessageList } from '@/components/MessageList'
import { MessageInput } from '@/components/MessageInput'
import { GaladrielSpamRemover } from '@/components/GaladrielSpamRemover'
import { PinnedMessages } from '@/components/PinnedMessages'
import { useStackr } from '@/hooks/useStackr'
import { UserBadges } from '@/components/UserBadges'
import { UserAchievements } from '@/components/UserAchievements'
import { ClubPolls } from '@/components/ClubPolls'
import { ClubEvents } from '@/components/ClubEvents'
import { ClubGovernance } from '@/components/ClubGovernance'
import { ClubContent } from '@/components/ClubContent'
import { ZkNoidGame } from '@/components/ZkNoidGame'
import { SportsBetting } from '@/components/SportsBetting'

interface ClubChatProps {
  clubId: string
  clubName: string
}

export function ClubChat({ clubId, clubName }: ClubChatProps) {
  const { wallet } = useWeb3Auth()
  const { client, conversations, sendMessage, streamAllMessages } = useXMTP(wallet)
  const [messages, setMessages] = useState<any[]>([])
  const [conversation, setConversation] = useState<any>(null)
  const [pinnedMessageIds, setPinnedMessageIds] = useState<string[]>([])
  const { incrementPoints, getUserPoints, getLeaderboard, getUserBadges, awardBadge } = useStackr()
  const [leaderboard, setLeaderboard] = useState<{address: string, points: number}[]>([])
  const [userBadges, setUserBadges] = useState<{[address: string]: UserBadge[]}>({})

  useEffect(() => {
    if (client) {
      const initConversation = async () => {
        const conv = await client.conversations.newConversation(clubId)
        setConversation(conv)
        const msgs = await conv.messages()
        setMessages(msgs.map(msg => ({ ...msg, likes: 0 })))
      }
      initConversation()
    }
  }, [client, clubId])

  useEffect(() => {
    if (conversation) {
      const stream = conversation.streamMessages()
      const subscription = stream.subscribe((message: any) => {
        setMessages(prevMessages => [...prevMessages, { ...message, likes: 0 }])
        // Award points for sending a message
        incrementPoints(message.senderAddress, 1, 'sent_message')
      })
      return () => subscription.unsubscribe()
    }
  }, [conversation, incrementPoints])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const lb = await getLeaderboard(5)
      setLeaderboard(lb)
    }
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [getLeaderboard])

  useEffect(() => {
    const fetchUserBadges = async () => {
      const badges: {[address: string]: UserBadge[]} = {};
      for (const user of leaderboard) {
        badges[user.address] = await getUserBadges(user.address);
      }
      setUserBadges(badges);
    };
    fetchUserBadges();
  }, [leaderboard, getUserBadges]);

  const handleSendMessage = async (content: string) => {
    if (conversation && wallet?.address) {
      await sendMessage(conversation, content)
      await incrementPoints(wallet.address, 1, 'sent_message')
      const userPoints = await getUserPoints(wallet.address)
      
      // Check for achievements
      if (userPoints >= 100 && !userBadges[wallet.address]?.some(badge => badge.id === '3')) {
        await awardBadge(wallet.address, '3')
        const updatedBadges = await getUserBadges(wallet.address)
        setUserBadges(prev => ({ ...prev, [wallet.address]: updatedBadges }))
      }
    }
  }

  const handleLikeMessage = async (messageId: string, sender: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId ? { ...msg, likes: (msg.likes || 0) + 1 } : msg
      )
    )
    // Award points for receiving a like
    await incrementPoints(sender, 5, 'received_like')
  }

  const handlePinMessage = async (messageId: string, sender: string) => {
    setPinnedMessageIds(prev => [...prev, messageId])
    // Award points for having a message pinned
    await incrementPoints(sender, 10, 'message_pinned')
  }

  const handleUnpinMessage = (messageId: string) => {
    setPinnedMessageIds(prev => prev.filter(id => id !== messageId))
  }

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => b.likes - a.likes);
  }, [messages]);

  const pinnedMessages = useMemo(() => {
    return messages.filter(msg => pinnedMessageIds.includes(msg.id))
  }, [messages, pinnedMessageIds])

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">{clubName} Chat</h2>
      <div className="mb-4">
        <h3 className="font-bold">Top Contributors</h3>
        <ul>
          {leaderboard.map((user, index) => (
            <li key={user.address} className="mb-2">
              <div>{index + 1}. {user.address.slice(0, 6)}...{user.address.slice(-4)} - {user.points} points</div>
              <UserBadges badges={userBadges[user.address] || []} />
            </li>
          ))}
        </ul>
      </div>
      <UserAchievements />
      <ClubPolls clubId={clubId} />
      <ClubEvents clubId={clubId} />
      <ClubGovernance clubId={clubId} />
      <ClubContent clubId={clubId} />
      <ZkNoidGame clubId={clubId} />
      <SportsBetting />
      <PinnedMessages messages={pinnedMessages} onUnpinMessage={handleUnpinMessage} />
      <div className="flex-grow overflow-y-auto mb-4">
        <MessageList 
          messages={sortedMessages} 
          currentUser={wallet?.address || ''}
          onLikeMessage={handleLikeMessage}
          onPinMessage={handlePinMessage}
          pinnedMessages={pinnedMessageIds}
        />
      </div>
      <GaladrielSpamRemover />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}