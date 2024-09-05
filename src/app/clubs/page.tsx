"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateClubDialog } from '@/components/CreateClubDialog'

export default function ClubsPage() {
  const [clubs, setClubs] = useState([])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clubs</h1>
      <CreateClubDialog />
      {clubs.length === 0 ? (
        <div className="bg-secondary p-4 rounded text-center text-sm mb-4">
          No clubs available
        </div>
      ) : (
        <ul>
          {clubs.map((club, index) => (
            <li key={index} className="mb-2">
              {/* Render club item */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}