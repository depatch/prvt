"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BellIcon, ChevronDownIcon, PaperclipIcon, SendIcon } from 'lucide-react'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'

const AGENTS = ['Club finder agent', 'Club creator agent', 'Calendar assistant']
const FEATURES = ['Chat private and onchain', 'Create verifiable clubs', 'Use AI agents on chat']

function HomePage() {
    const router = useRouter()

    useEffect(() => {
        const isConnected = localStorage.getItem('isConnected')
        const isProfileCompleted = localStorage.getItem('isProfileCompleted')

        if (isConnected !== 'true') {
            router.replace('/')
        } else if (isProfileCompleted !== 'true') {
            router.replace('/complete-profile')
        }
    }, [router])

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-1 flex">
                <Sidebar />
                <MainContent />
            </main>
            <Footer />
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

function Sidebar() {
    return (
        <aside className="w-1/4 bg-card p-4">
            <UserProfile />
            <ChatSection />
            <ClubSection />
        </aside>
    )
}

function UserProfile() {
    return (
        <div className="flex items-center mb-4">
            <Avatar className="w-10 h-10 mr-2">
                <AvatarImage src="/path-to-avatar.jpg" alt="Aysi" />
                <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-bold">Aysi</h3>
                <span className="text-sm text-muted-foreground">Non-verified</span>
            </div>
            <ConnectWalletButton />
        </div>
    )
}

// Helper function to shorten wallet addresses
function shortenAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function ChatSection() {
    return (
        <>
            <h4 className="font-bold mb-2">Chats</h4>
            <Button className="w-full text-left mb-4">+ Create new message</Button>
            <div className="bg-secondary p-4 rounded text-center text-sm mb-4">
                You don&apos;t have any chats
            </div>
        </>
    )
}

function ClubSection() {
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">Discover latest clubs</h4>
                <Button>+ Create yours</Button>
            </div>
            {/* Add club list here */}
            <Link href="#" className="text-sm text-primary">See all →</Link>
        </>
    )
}

function MainContent() {
    return (
        <section className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {AGENTS.map((agent) => (
                    <div key={agent} className="bg-card p-4 rounded">
                        <h3 className="font-bold mb-2">{agent}</h3>
                        <span className="text-sm text-muted-foreground">Coming soon</span>
                    </div>
                ))}
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
    return (
        <footer className="bg-card p-4">
            <div className="flex items-center bg-secondary rounded-full p-2">
                <Button className="mr-2">
                    <PaperclipIcon className="h-5 w-5" />
                </Button>
                <Input placeholder="Message Private" className="flex-1 bg-transparent border-none" />
                <Button>
                    <SendIcon className="h-5 w-5" />
                </Button>
            </div>
        </footer>
    )
}

export default HomePage