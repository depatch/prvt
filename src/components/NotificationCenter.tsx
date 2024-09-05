import React, { useState, useEffect } from 'react'
import { useXMTP } from '@/hooks/useXMTP'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<string[]>([])
  const { wallet } = useWeb3Auth()
  const { client, streamAllMessages } = useXMTP(wallet)

  useEffect(() => {
    if (client) {
      const handleNewMessage = (message: any) => {
        if (message.content.startsWith('NOTIFICATION:')) {
          setNotifications(prev => [...prev, message.content.slice(13)])
        }
      }

      streamAllMessages(handleNewMessage)
    }
  }, [client, streamAllMessages])

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className="mb-2 p-2 bg-secondary rounded">{notification}</li>
          ))}
        </ul>
      )}
    </div>
  )
}