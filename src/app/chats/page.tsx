"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateMessageDialog } from '@/components/CreateMessageDialog'

export default function ChatsPage() {
  const [chats, setChats] = useState([])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <CreateMessageDialog />
      {chats.length === 0 ? (
        <div className="bg-secondary p-4 rounded text-center text-sm mb-4">
          You don&apos;t have any chats
        </div>
      ) : (
        <ul>
          {chats.map((chat, index) => (
            <li key={index} className="mb-2">
              {/* Render chat item */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}