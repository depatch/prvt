import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const tutorialSteps = [
  {
    target: '#user-profile',
    content: 'This is your user profile. You can see your username, ENS name, and verification status here.'
  },
  {
    target: '#chats-section',
    content: 'Here you can start new conversations and see your existing chats.'
  },
  {
    target: '#clubs-section',
    content: 'Discover and join clubs or create your own here.'
  },
  {
    target: '#ai-agents',
    content: 'These AI agents can help you find clubs, create clubs, and manage spam.'
  }
]

export function OnboardingTutorial() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem('hasCompletedTutorial')
    if (hasCompletedTutorial) {
      setIsVisible(false)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsVisible(false)
      localStorage.setItem('hasCompletedTutorial', 'true')
    }
  }

  if (!isVisible) return null

  const { target, content } = tutorialSteps[currentStep]

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <p className="mb-2">{content}</p>
      <Button onClick={handleNext}>
        {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
      </Button>
    </div>
  )
}