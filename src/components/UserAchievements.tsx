import React, { useState, useEffect } from 'react'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useStackr } from '@/hooks/useStackr'
import { UserBadges } from '@/components/UserBadges'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'Newcomer', description: 'Earn your first 10 points', icon: '🌱', requiredPoints: 10 },
  { id: '2', name: 'Regular', description: 'Earn 100 points', icon: '🌟', requiredPoints: 100 },
  { id: '3', name: 'Enthusiast', description: 'Earn 500 points', icon: '🚀', requiredPoints: 500 },
  { id: '4', name: 'Expert', description: 'Earn 1000 points', icon: '👑', requiredPoints: 1000 },
  { id: '5', name: 'Legend', description: 'Earn 5000 points', icon: '🏆', requiredPoints: 5000 },
  { id: '6', name: 'Poll Master', description: 'Create 5 polls', icon: '📊', requiredPoints: 0 },
  { id: '7', name: 'Active Voter', description: 'Vote in 20 polls', icon: '🗳️', requiredPoints: 0 },
  { id: '8', name: 'Event Organizer', description: 'Organize 3 club events', icon: '📅', requiredPoints: 0 },
]

export function UserAchievements() {
  const { address } = useWeb3Auth()
  const { getUserPoints, getUserAchievements, checkAndAwardAchievements } = useStackr()
  const [userPoints, setUserPoints] = useState(0)
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      if (address) {
        const points = await getUserPoints(address)
        const achievements = await getUserAchievements(address)
        setUserPoints(points)
        setUserAchievements(achievements)

        // Check for new achievements
        await checkAndAwardAchievements(address)
      }
    }

    fetchUserData()
    const interval = setInterval(fetchUserData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [address, getUserPoints, getUserAchievements, checkAndAwardAchievements])

  const getNextAchievement = () => {
    return ACHIEVEMENTS.find(achievement => !userAchievements.some(ua => ua.id === achievement.id))
  }

  const nextAchievement = getNextAchievement()

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">Your Achievements</h3>
      <p className="mb-2">Total Points: {userPoints}</p>
      <UserBadges badges={userAchievements} />
      {nextAchievement && (
        <div className="mt-4">
          <p>Next Achievement: {nextAchievement.name}</p>
          <p className="text-sm text-muted-foreground">{nextAchievement.description}</p>
          {nextAchievement.requiredPoints > 0 && (
            <Progress 
              value={(userPoints / nextAchievement.requiredPoints) * 100} 
              className="mt-2"
            />
          )}
        </div>
      )}
    </div>
  )
}