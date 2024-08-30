import { useEffect, useState } from "react"
import { Client } from "@xmtp/xmtp-js"
import { ethers } from "ethers"

interface ActiveSessionProps {
  provider: any
}

export default function ActiveSession({ provider }: ActiveSessionProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [conversation, setConversation] = useState<any | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [peerAddress, setPeerAddress] = useState("")

  useEffect(() => {
    const initXmtp = async () => {
      if (provider) {
        try {
          const signer = new ethers.BrowserProvider(provider).getSigner()
          const xmtp = await Client.create(await signer)
          setClient(xmtp)
        } catch (error) {
          console.error("Error initializing XMTP client:", error)
        }
      }
    }

    initXmtp()
  }, [provider])

  const startConversation = async () => {
    if (client && peerAddress) {
      try {
        const conversation = await client.conversations.newConversation(peerAddress)
        setConversation(conversation)
        const messages = await conversation.messages()
        setMessages(messages)
      } catch (error) {
        console.error("Error starting conversation:", error)
      }
    }
  }

  const sendMessage = async () => {
    if (conversation && newMessage) {
      await conversation.send(newMessage)
      setNewMessage("")
      const messages = await conversation.messages()
      setMessages(messages)
    }
  }

  return (
    <div className="mt-4">
      {client ? (
        conversation ? (
          <div>
            <h2 className="text-lg font-medium mb-4">Conversation with {conversation.peerAddress}</h2>
            <div className="border rounded p-4 mb-4 h-64 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <span className="font-bold">{message.senderAddress === client.address ? "You" : "Peer"}:</span> {message.content}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="border rounded p-2 flex-grow mr-2"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-medium mb-4">Start a conversation</h2>
            <div className="flex">
              <input
                type="text"
                value={peerAddress}
                onChange={(e) => setPeerAddress(e.target.value)}
                className="border rounded p-2 flex-grow mr-2"
                placeholder="Enter peer address"
              />
              <button
                onClick={startConversation}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Start Chat
              </button>
            </div>
          </div>
        )
      ) : (
        <div>Initializing XMTP client...</div>
      )}
    </div>
  )
}