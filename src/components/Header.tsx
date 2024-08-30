import Link from 'next/link'
import dynamic from 'next/dynamic'

const ConnectWallet = dynamic(() => import('./ConnectWallet'), { ssr: false })

export function Header() {
    return (
        <header className="flex justify-between items-center p-4">
            <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-white rounded-full mr-2"></div>
                <span className="text-lg">Private</span>
            </div>
            <div className="flex items-center">
                <button className="bg-[#222] px-4 py-2 rounded-full text-sm mr-4">Launch app</button>
                <ConnectWallet />
            </div>
        </header>
    )
}