import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useStackr } from '@/hooks/useStackr'

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
}

export function ClubEvents({ clubId }: { clubId: string }) {
  const [events, setEvents] = useState<Event[]>([])
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDescription, setNewEventDescription] = useState('')
  const [newEventStartTime, setNewEventStartTime] = useState('')
  const [newEventEndTime, setNewEventEndTime] = useState('')
  const { address } = useWeb3Auth()
  const { incrementPoints, checkAndAwardAchievements } = useStackr()

  useEffect(() => {
    // TODO: Fetch existing events from backend or Stackr
    // This is a placeholder implementation
    setEvents([
      {
        id: '1',
        title: 'NFT Showcase',
        description: 'Show off your favorite NFTs!',
        startTime: new Date(Date.now() + 86400000), // 24 hours from now
        endTime: new Date(Date.now() + 90000000), // 25 hours from now
        attendees: ['0x1234...5678', '0x5678...9012'],
      },
    ])
  }, [clubId])

  const handleCreateEvent = async () => {
    if (newEventTitle && newEventDescription && newEventStartTime && newEventEndTime) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: newEventTitle,
        description: newEventDescription,
        startTime: new Date(newEventStartTime),
        endTime: new Date(newEventEndTime),
        attendees: [address || ''],
      }
      setEvents([...events, newEvent])
      setNewEventTitle('')
      setNewEventDescription('')
      setNewEventStartTime('')
      setNewEventEndTime('')
      await incrementPoints(address || '', 20, 'created_event')
      await checkAndAwardAchievements(address || '')
    }
  }

  const handleAttendEvent = async (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId && address && !event.attendees.includes(address)) {
        return {
          ...event,
          attendees: [...event.attendees, address],
        }
      }
      return event
    }))
    await incrementPoints(address || '', 10, 'attended_event')
    await checkAndAwardAchievements(address || '')
  }

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">Club Events</h3>
      {events.map(event => (
        <div key={event.id} className="mb-4 p-2 bg-secondary rounded">
          <h4 className="font-bold">{event.title}</h4>
          <p className="text-sm">{event.description}</p>
          <p className="text-sm text-muted-foreground">
            Starts: {event.startTime.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Ends: {event.endTime.toLocaleString()}
          </p>
          <p className="text-sm">Attendees: {event.attendees.length}</p>
          <Button 
            onClick={() => handleAttendEvent(event.id)} 
            size="sm" 
            className="mt-2"
            disabled={address && event.attendees.includes(address)}
          >
            {address && event.attendees.includes(address) ? 'Attending' : 'Attend'}
          </Button>
        </div>
      ))}
      <div className="mt-4">
        <h4 className="font-bold mb-2">Create New Event</h4>
        <Input
          placeholder="Event title"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Event description"
          value={newEventDescription}
          onChange={(e) => setNewEventDescription(e.target.value)}
          className="mb-2"
        />
        <Input
          type="datetime-local"
          placeholder="Start time"
          value={newEventStartTime}
          onChange={(e) => setNewEventStartTime(e.target.value)}
          className="mb-2"
        />
        <Input
          type="datetime-local"
          placeholder="End time"
          value={newEventEndTime}
          onChange={(e) => setNewEventEndTime(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleCreateEvent}>Create Event</Button>
      </div>
    </div>
  )
}