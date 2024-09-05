"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BellIcon, ChevronDownIcon, PaperclipIcon, SendIcon } from 'lucide-react'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'
import { createKintoSDK, KintoAccountInfo } from 'kinto-web-sdk';
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useENS } from '@/hooks/useENS'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageInput } from '@/components/MessageInput'
import { useMessages } from '@/contexts/MessageContext'
import { useXMTP } from '@/hooks/useXMTP';
import { Wallet } from 'ethers';
import { MessageList } from '@/components/MessageList';
import { Toast } from "@/components/ui/toast"
import { Loader2 } from 'lucide-react'
import { OnboardingTutorial } from '@/components/OnboardingTutorial'
import { ClubCreatorAgent } from '@/components/ClubCreatorAgent'
import { GaladrielSpamRemover } from '@/components/GaladrielSpamRemover'
import { ClubFinderAgent } from '@/components/ClubFinderAgent'
import { NotificationCenter } from '@/components/NotificationCenter'

const AGENTS = ['Club finder agent', 'Club creator agent', 'Galadriel spam remover agent']
const FEATURES = ['Chat private and onchain', 'Create verifiable clubs', 'Use AI agents on chat']

function HomePage() {
    const router = useRouter()
    const { address, isConnected } = useWeb3Auth()
    const [profileData, setProfileData] = useState(null)
    const { wallet } = useWeb3Auth();
    const { client, conversations, startConversation, sendMessage, streamAllMessages, loadConversations, loadMoreMessages, error, clearError } = useXMTP(wallet);
    const { messages, addMessage } = useMessages();

    useEffect(() => {
        if (!isConnected) {
            router.replace('/')
        } else if (!localStorage.getItem('isProfileCompleted')) {
            router.replace('/complete-profile')
        } else {
            // Fetch profile data
            fetchProfileData(address)
        }
    }, [router, isConnected, address])

    useEffect(() => {
        if (client) {
            streamAllMessages((message) => {
                console.log(`New message from ${message.senderAddress}: ${message.content}`);
                addMessage({
                    id: message.id,
                    content: message.content,
                    sender: message.senderAddress,
                    timestamp: new Date(message.sent),
                    conversationTopic: message.conversationTopic,
                });
            });
        }
    }, [client, streamAllMessages, addMessage]);

    async function fetchProfileData(address: string) {
        // TODO: Implement actual profile data fetching from your backend or blockchain
        // This is a placeholder implementation
        const mockProfileData = {
            username: 'CryptoUser',
            selectedNFT: 1,
            isPremium: true,
        }
        setProfileData(mockProfileData)
    }

    if (!profileData) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-1 flex">
                <Sidebar profileData={profileData} />
                <div className="flex-1 flex flex-col">
                    <MainContent />
                    <NotificationCenter />
                </div>
            </main>
            <Footer />
            <OnboardingTutorial />
        </div>
    )
}

function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-dark-surface">
            <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-white rounded-full mr-2"></div>
                <span className="text-lg">Private</span>
            </div>
            <div className="flex items-center">
                <Button className="mr-4">
                    <BellIcon className="h-5 w-5" />
                </Button>
                <ConnectWalletButton />
            </div>
        </header>
    )
}

function Sidebar({ profileData }) {
    return (
        <aside className="w-1/4 bg-card p-4">
            <div id="user-profile">
                <UserProfile profileData={profileData} />
            </div>
            <nav>
                <ul>
                    <li id="chats-section">
                        <Link href="/chats" className="block py-2 px-4 hover:bg-secondary rounded">
                            Chats
                        </Link>
                    </li>
                    <li id="clubs-section">
                        <Link href="/clubs" className="block py-2 px-4 hover:bg-secondary rounded">
                            Clubs
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

function UserProfile({ profileData }) {
    const { address } = useWeb3Auth()
    const { ensName } = useENS(address)
    const [accountInfo, setAccountInfo] = useState<KintoAccountInfo | null>(null)
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        async function fetchKintoInfo() {
            if (address) {
                const kintoSDK = createKintoSDK('0x14A1EC9b43c270a61cDD89B6CbdD985935D897fE') // Replace with your actual contract address
                try {
                    const info = await kintoSDK.connect()
                    setAccountInfo(info)
                    setIsVerified(true)
                } catch (error) {
                    console.error('Failed to fetch Kinto info:', error)
                    setIsVerified(false)
                }
            }
        }

        fetchKintoInfo()
    }, [address])

    return (
        <div className="flex items-center mb-4">
            <Avatar className="w-10 h-10 mr-2">
                <AvatarImage src={accountInfo?.profileImage || '/default-avatar.jpg'} alt="User" />
                <AvatarFallback>{ensName?.slice(0, 2) || address?.slice(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-bold">{ensName || shortenAddress(address || '')}</h3>
                <span className={`text-sm ${isVerified ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {isVerified ? 'Verified' : 'Non-verified'}
                </span>
            </div>
        </div>
    )
}

// Helper function to shorten wallet addresses
function shortenAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function CreateMessageDialog({ onCreateMessage }) {
    const [recipient, setRecipient] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCreateMessage = async () => {
        if (!recipient.trim()) {
            setError("Please enter a recipient address or ENS name")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            await onCreateMessage(recipient)
            // Close the dialog and reset the form
            setRecipient('')
        } catch (error) {
            console.error("Failed to create message:", error)
            setError("Failed to start conversation. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full text-left mb-4">+ Create new message</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Recipient address or ENS name"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        disabled={isLoading}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button onClick={handleCreateMessage} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Starting Conversation...
                            </>
                        ) : (
                            'Start Conversation'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ChatSection() {
    const { wallet } = useWeb3Auth();
    const { conversations, sendMessage, startConversation, loadConversations, loadMoreMessages, error, clearError } = useXMTP(wallet);
    const { messages, addMessage } = useMessages();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        async function init() {
            setIsLoading(true);
            await loadConversations();
            setIsLoading(false);
        }
        init();
    }, [loadConversations]);

    const handleCreateMessage = async (recipient: string) => {
        try {
            const conversation = await startConversation(recipient);
            if (conversation) {
                setSelectedConversation(conversation);
            }
        } catch (error) {
            console.error("Failed to start conversation:", error);
        }
    };

    const handleSendMessage = async (content: string) => {
        if (selectedConversation) {
            try {
                const message = await sendMessage(selectedConversation, content);
                if (message) {
                    addMessage({
                        id: message.id,
                        content: message.content,
                        sender: message.senderAddress,
                        timestamp: new Date(message.sent),
                        conversationTopic: selectedConversation.topic,
                    });
                }
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        } else {
            console.log("No active conversation");
        }
    };

    const handleLoadMore = async () => {
        if (selectedConversation && messages.length > 0) {
            setIsLoadingMore(true);
            const oldestMessage = messages[0];
            const moreMessages = await loadMoreMessages(selectedConversation, oldestMessage.timestamp);
            moreMessages.forEach(msg => addMessage({
                id: msg.id,
                content: msg.content,
                sender: msg.senderAddress,
                timestamp: new Date(msg.sent),
                conversationTopic: selectedConversation.topic,
            }));
            setIsLoadingMore(false);
        }
    };

    return (
        <>
            <h4 className="font-bold mb-2">Chats</h4>
            <CreateMessageDialog onCreateMessage={handleCreateMessage} />
            <div className="flex h-full">
                <div className="w-1/3 border-r">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center p-4">No conversations yet</div>
                    ) : (
                        conversations.map((convo) => (
                            <div
                                key={convo.topic}
                                className={`p-2 cursor-pointer ${selectedConversation === convo ? 'bg-secondary' : ''}`}
                                onClick={() => setSelectedConversation(convo)}
                            >
                                {convo.peerAddress}
                            </div>
                        ))
                    )}
                </div>
                <div className="w-2/3">
                    {selectedConversation ? (
                        <>
                            <button 
                                onClick={handleLoadMore} 
                                disabled={isLoadingMore}
                                className="mb-2 p-2 bg-secondary rounded"
                            >
                                {isLoadingMore ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Load More'
                                )}
                            </button>
                            <MessageList 
                                messages={messages.filter(m => m.conversationTopic === selectedConversation.topic)} 
                                currentUser={wallet.address} 
                            />
                            <MessageInput onSendMessage={handleSendMessage} />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            Select a conversation or start a new one
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <Toast
                    title="Error"
                    description={error}
                    onClose={clearError}
                />
            )}
        </>
    );
}

function CreateClubDialog() {
    const [clubName, setClubName] = useState('')
    const [clubDescription, setClubDescription] = useState('')

    const handleCreateClub = () => {
        // TODO: Implement club creation logic
        console.log('Creating new club:', { name: clubName, description: clubDescription })
        // Close the dialog and reset the form
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>+ Create yours</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Club</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Club name"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                    />
                    <Input
                        placeholder="Club description"
                        value={clubDescription}
                        onChange={(e) => setClubDescription(e.target.value)}
                    />
                    <Button onClick={handleCreateClub}>Create Club</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ClubSection() {
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">Discover latest clubs</h4>
                <CreateClubDialog />
            </div>
            {/* Add club list here */}
            <Link href="#" className="text-sm text-primary">See all →</Link>
        </>
    )
}

function MainContent() {
    return (
        <section className="flex-1 p-4">
            <div id="ai-agents" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <ClubFinderAgent />
                <ClubCreatorAgent />
                <GaladrielSpamRemover />
            </div>
            <div className="bg-card p-6 rounded">
                <h2 className="text-2xl font-bold mb-6">Private</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {FEATURES.map((feature) => (
                        <div key={feature} className="bg-secondary p-4 rounded">
                            <h3 className="font-bold mb-2">{feature}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Footer() {
    const { addMessage } = useMessages();
    const { conversations, sendMessage } = useXMTP(null); // You should pass the actual wallet here

    const handleSendMessage = async (content: string) => {
        // For demonstration, we're sending to the first conversation. In a real app, you'd select the correct conversation.
        if (conversations.length > 0) {
            const message = await sendMessage(conversations[0], content);
            if (message) {
                addMessage({
                    content: message.content,
                    sender: message.senderAddress,
                });
            }
        } else {
            console.log("No active conversations");
        }
    };

    return (
        <footer className="bg-card p-4">
            <MessageInput onSendMessage={handleSendMessage} />
        </footer>
    );
}

export default HomePage