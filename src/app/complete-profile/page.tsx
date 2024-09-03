"use client"
import React, { useState } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useRouter } from 'next/navigation'

export default function CompleteProfile() {
    const [username, setUsername] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Username submitted:', username)
        router.push('/home')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4"
                />
                <Button type="submit" className="w-full">
                    Complete Profile
                </Button>
            </form>
        </div>
    )
}