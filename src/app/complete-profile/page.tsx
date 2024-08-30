import React, { useState } from 'react'

const CompleteProfilePage: React.FC = () => {
    const [username, setUsername] = useState('')
    const [avatar, setAvatar] = useState<File | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Implement profile completion logic here
        console.log('Profile completed:', { username, avatar })
    }

    return (
        <div className="min-h-screen bg-[#111] flex items-center justify-center">
            <div className="bg-[#1A1A1A] p-8 rounded-lg w-96">
                <div className="flex justify-between items-center mb-6">
                    <button className="text-gray-400">←</button>
                    <h2 className="text-2xl font-bold text-white">Complete profile</h2>
                    <button className="text-gray-400">✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full mb-4 p-3 bg-[#222] text-white rounded border border-gray-700"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-purple-600 rounded-full mr-2 flex items-center justify-center">
                            {avatar ? '🖼️' : '👤'}
                        </div>
                        <button type="button" className="bg-[#222] text-white px-4 py-2 rounded">Upload</button>
                    </div>
                    <button type="submit" className="w-full bg-white text-black p-3 rounded font-bold">
                        Complete
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CompleteProfilePage