import { useState } from 'react'
import { useRouter } from 'next/router'
import ConnectWallet from '../components/ConnectWallet' // Corrected import path

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault()
        // Implement sign up logic here
        console.log('Sign up with:', email, password)
        router.push('/app')
    }

    return (
        <div className="min-h-screen bg-[#111] flex items-center justify-center">
            <div className="bg-[#1A1A1A] p-8 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-white">Sign up to ChatApp</h2>
                <form onSubmit={handleSignUp}>
                    <input
                        type="text"
                        placeholder="Email or username"
                        className="w-full mb-4 p-3 bg-[#222] text-white rounded border border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 bg-[#222] text-white rounded border border-gray-700"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {/* Add eye icon for password visibility toggle */}
                        </button>
                    </div>
                    <button type="submit" className="w-full bg-white text-black p-3 rounded font-bold mb-4">
                        Sign up
                    </button>
                </form>
                <div className="text-center mb-4">
                    <p className="text-sm text-gray-400 mb-2">Or authorize with</p>
                    <div className="flex justify-center space-x-4">
                        <button className="bg-[#222] text-white px-4 py-2 rounded flex items-center">
                            <span className="mr-2">G</span> Google
                        </button>
                        <button className="bg-[#222] text-white px-4 py-2 rounded flex items-center">
                            <span className="mr-2">🍎</span> Apple
                        </button>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-400">
                    Already have an account? <a href="/login" className="text-blue-400 hover:underline">Log in</a>
                </p>
            </div>
            <div className="absolute bottom-4 text-white text-sm">
                Powered by <span className="font-bold">Web3Auth</span>
            </div>
        </div>
    )
}