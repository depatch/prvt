import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ConnectWalletButton } from './ConnectWalletButton' // Import the new button
import { KintoConnect } from './VerifyButton' 

export function Header() {
    return (
        <header className="flex justify-between items-center p-4">
            <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-white rounded-full mr-2"></div>
                <span className="text-lg">Private</span>
            </div>
            <div className="flex items-center">
                <ConnectWalletButton /> {/* Use the new button here */}
                <KintoConnect />
            </div>
        </header>
    )
}