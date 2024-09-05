import React from 'react'
import { Badge } from '@/components/ui/badge'

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface UserBadgesProps {
  badges: UserBadge[];
}

export function UserBadges({ badges }: UserBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <Badge key={badge.id} variant="secondary" className="flex items-center gap-1">
          <span className="text-lg">{badge.icon}</span>
          <span>{badge.name}</span>
        </Badge>
      ))}
    </div>
  )
}