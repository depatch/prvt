import React, { useState, useMemo, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Star, Pin } from 'lucide-react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { createKintoSDK } from 'kinto-web-sdk';
import { useStackr } from '@/hooks/useStackr'; // Assume we've created this hook to interact with Stackr

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  likes: number;
}

interface MessageListProps {
  messages: Message[];
  currentUser: string;
  onLikeMessage: (messageId: string) => void;
  onPinMessage: (messageId: string) => void;
  pinnedMessages: string[];
}

export function MessageList({ messages, currentUser, onLikeMessage, onPinMessage, pinnedMessages }: MessageListProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const { address } = useWeb3Auth();
  const [userPoints, setUserPoints] = useState<{[key: string]: number}>({});
  const { incrementPoints, getUserPoints } = useStackr(); // Using our Stackr hook

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => b.likes - a.likes);
  }, [messages]);

  useEffect(() => {
    // TODO: Implement Stackr micro-rollup initialization
    // 1. Initialize Stackr client
    // 2. Fetch initial points for all users
    const fetchPoints = async () => {
      // TODO: Replace this with actual Stackr implementation
      const points: {[key: string]: number} = {};
      for (const message of messages) {
        if (!points[message.sender]) {
          points[message.sender] = await getUserPoints(message.sender);
        }
      }
      setUserPoints(points);
    };
    fetchPoints();
  }, [messages, getUserPoints]);

  const handleLike = async (messageId: string, sender: string) => {
    const kintoSDK = createKintoSDK('0x14A1EC9b43c270a61cDD89B6CbdD985935D897fE');
    try {
      const accountInfo = await kintoSDK.connect();
      if (accountInfo.isVerified) {
        onLikeMessage(messageId);
        // TODO: Implement Stackr micro-rollup point increment
        // 1. Call Stackr's incrementPoints function
        // 2. Update local state with new points
        await incrementPoints(sender, 1); // Increment by 1 point for a like
        const newPoints = await getUserPoints(sender);
        setUserPoints(prevPoints => ({
          ...prevPoints,
          [sender]: newPoints
        }));
      } else {
        alert('Please verify your account with Kinto to start earning points from likes.');
        setIsVerifying(true);
        await kintoSDK.startKYC();
        setIsVerifying(false);
      }
    } catch (error) {
      console.error('Error liking message:', error);
      setIsVerifying(false);
    }
  };

  const getMessageStyle = (likes: number) => {
    if (likes >= 10) return 'border-2 border-yellow-500 bg-yellow-50';
    if (likes >= 5) return 'border-2 border-blue-500 bg-blue-50';
    return '';
  };

  return (
    <div className="space-y-4">
      {sortedMessages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'} ${getMessageStyle(message.likes)}`}
        >
          <div className={`flex items-start space-x-2 ${message.sender === currentUser ? 'flex-row-reverse' : ''}`}>
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${message.sender}`} />
              <AvatarFallback>{message.sender.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center mb-1">
                <span className="text-sm font-bold mr-2">{message.sender.slice(0, 6)}...</span>
                <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleString()}</span>
                {userPoints[message.sender] > 100 && <Star className="w-4 h-4 text-yellow-500 ml-2" />}
              </div>
              <div className={`bg-primary text-primary-foreground p-2 rounded-lg ${message.sender === currentUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                {message.content}
              </div>
              <div className="flex items-center mt-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleLike(message.id, message.sender)}
                  disabled={isVerifying}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {message.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPinMessage(message.id)}
                  disabled={pinnedMessages.includes(message.id)}
                >
                  <Pin className="w-4 h-4 mr-1" />
                  {pinnedMessages.includes(message.id) ? 'Pinned' : 'Pin'}
                </Button>
                <span className="text-xs text-muted-foreground ml-2">
                  Points: {userPoints[message.sender] || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}