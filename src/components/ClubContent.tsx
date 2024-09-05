import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useStackr } from '@/hooks/useStackr'

interface Content {
  id: string;
  title: string;
  description: string;
  contentType: 'text' | 'image' | 'video' | 'link';
  url?: string;
  createdBy: string;
  createdAt: number;
  likes: string[];
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  createdBy: string;
  createdAt: number;
}

export function ClubContent({ clubId }: { clubId: string }) {
  const [contents, setContents] = useState<Content[]>([])
  const [newContentTitle, setNewContentTitle] = useState('')
  const [newContentDescription, setNewContentDescription] = useState('')
  const [newContentType, setNewContentType] = useState<'text' | 'image' | 'video' | 'link'>('text')
  const [newContentUrl, setNewContentUrl] = useState('')
  const { address } = useWeb3Auth()
  const { incrementPoints, checkAndAwardAchievements } = useStackr()

  useEffect(() => {
    // TODO: Fetch existing content from backend or Stackr
    // This is a placeholder implementation
    setContents([
      {
        id: '1',
        title: 'Welcome to our club!',
        description: 'This is our first club post. Feel free to share your thoughts and ideas here.',
        contentType: 'text',
        createdBy: '0x1234...5678',
        createdAt: Date.now() - 86400000, // 1 day ago
        likes: ['0x1234...5678', '0x5678...9012'],
        comments: [
          {
            id: '1',
            content: 'Great to be here!',
            createdBy: '0x5678...9012',
            createdAt: Date.now() - 3600000, // 1 hour ago
          }
        ],
      },
    ])
  }, [clubId])

  const handleCreateContent = async () => {
    if (newContentTitle && newContentDescription) {
      const newContent: Content = {
        id: Date.now().toString(),
        title: newContentTitle,
        description: newContentDescription,
        contentType: newContentType,
        url: newContentUrl,
        createdBy: address || '',
        createdAt: Date.now(),
        likes: [],
        comments: [],
      }
      setContents([newContent, ...contents])
      setNewContentTitle('')
      setNewContentDescription('')
      setNewContentType('text')
      setNewContentUrl('')
      await incrementPoints(address || '', 20, 'created_content')
      await checkAndAwardAchievements(address || '')
    }
  }

  const handleLikeContent = async (contentId: string) => {
    setContents(contents.map(content => {
      if (content.id === contentId && address) {
        const updatedLikes = content.likes.includes(address)
          ? content.likes.filter(like => like !== address)
          : [...content.likes, address]
        return { ...content, likes: updatedLikes }
      }
      return content
    }))
    await incrementPoints(address || '', 5, 'liked_content')
    await checkAndAwardAchievements(address || '')
  }

  const handleAddComment = async (contentId: string, commentText: string) => {
    if (commentText.trim() && address) {
      const newComment: Comment = {
        id: Date.now().toString(),
        content: commentText.trim(),
        createdBy: address,
        createdAt: Date.now(),
      }
      setContents(contents.map(content => {
        if (content.id === contentId) {
          return { ...content, comments: [...content.comments, newComment] }
        }
        return content
      }))
      await incrementPoints(address, 10, 'commented_on_content')
      await checkAndAwardAchievements(address)
    }
  }

  return (
    <div className="bg-card p-4 rounded">
      <h3 className="font-bold mb-2">Club Content</h3>
      <div className="mb-4">
        <Input
          placeholder="Content Title"
          value={newContentTitle}
          onChange={(e) => setNewContentTitle(e.target.value)}
          className="mb-2"
        />
        <Textarea
          placeholder="Content Description"
          value={newContentDescription}
          onChange={(e) => setNewContentDescription(e.target.value)}
          className="mb-2"
        />
        <select
          value={newContentType}
          onChange={(e) => setNewContentType(e.target.value as 'text' | 'image' | 'video' | 'link')}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="link">Link</option>
        </select>
        {newContentType !== 'text' && (
          <Input
            placeholder="Content URL"
            value={newContentUrl}
            onChange={(e) => setNewContentUrl(e.target.value)}
            className="mb-2"
          />
        )}
        <Button onClick={handleCreateContent}>Create Content</Button>
      </div>
      {contents.map(content => (
        <div key={content.id} className="mb-4 p-2 bg-secondary rounded">
          <h4 className="font-bold">{content.title}</h4>
          <p className="text-sm">{content.description}</p>
          {content.url && (
            <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View {content.contentType}
            </a>
          )}
          <p className="text-sm text-muted-foreground">
            Created by: {content.createdBy.slice(0, 6)}...{content.createdBy.slice(-4)} | 
            {new Date(content.createdAt).toLocaleString()}
          </p>
          <Button 
            onClick={() => handleLikeContent(content.id)}
            size="sm"
            variant={content.likes.includes(address || '') ? "secondary" : "ghost"}
            className="mr-2 mt-2"
          >
            {content.likes.includes(address || '') ? 'Unlike' : 'Like'} ({content.likes.length})
          </Button>
          <div className="mt-2">
            <h5 className="font-bold">Comments</h5>
            {content.comments.map(comment => (
              <div key={comment.id} className="text-sm mt-1">
                <span className="font-bold">{comment.createdBy.slice(0, 6)}...{comment.createdBy.slice(-4)}: </span>
                {comment.content}
              </div>
            ))}
            <Input
              placeholder="Add a comment"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment(content.id, (e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }}
              className="mt-2"
            />
          </div>
        </div>
      ))}
    </div>
  )
}