import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

interface ClubSharingProps {
  clubId: string
  clubName: string
}

export function ClubSharing({ clubId, clubName }: ClubSharingProps) {
  const [shareableLink, setShareableLink] = useState('')
  const [canView, setCanView] = useState(true)
  const [canJoin, setCanJoin] = useState(false)
  const [canInvite, setCanInvite] = useState(false)

  const generateShareableLink = () => {
    // In a real application, you'd want to generate this link on the server
    // and possibly encrypt the permissions
    const baseUrl = window.location.origin
    const permissions = `${canView ? 1 : 0}${canJoin ? 1 : 0}${canInvite ? 1 : 0}`
    const link = `${baseUrl}/clubs/${clubId}?permissions=${permissions}`
    setShareableLink(link)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link: ', err))
  }

  return (
    <div className="mt-4">
      <h3 className="font-bold mb-2">Share Club</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="canView" checked={canView} onCheckedChange={setCanView} />
          <label htmlFor="canView">Can view club details</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="canJoin" checked={canJoin} onCheckedChange={setCanJoin} />
          <label htmlFor="canJoin">Can request to join</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="canInvite" checked={canInvite} onCheckedChange={setCanInvite} />
          <label htmlFor="canInvite">Can invite others</label>
        </div>
        <Button onClick={generateShareableLink}>Generate Shareable Link</Button>
        {shareableLink && (
          <div className="mt-2">
            <Input value={shareableLink} readOnly />
            <Button onClick={copyToClipboard} className="mt-2">Copy Link</Button>
          </div>
        )}
      </div>
    </div>
  )
}