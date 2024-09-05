import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  conversationTopic: string
}

interface MessageContextType {
  messages: Message[]
  addMessage: (message: Message) => void
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider')
  }
  return context
}