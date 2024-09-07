import { useState } from 'react'
import { useXmtp } from '../hooks/useXMTP'
import styles from './NewConversation.module.css'
import { useWeb3Auth } from '../hooks/useWeb3Auth'

interface NewConversationProps {
  onConversationCreated: (conversation: any) => void;
  provider: any;
}

export default function NewConversation({ onConversationCreated, provider }: NewConversationProps) {
  const [recipientAddress, setRecipientAddress] = useState('')
  const { xmtpClient, canMessage } = useXmtp(useWeb3Auth().address, useWeb3Auth().provider)

  const handleStartConversation = async () => {
    if (xmtpClient && recipientAddress) {
      try {
        // Check if the recipient is on the XMTP network
        const canMessageRecipient = await canMessage(recipientAddress)
        if (!canMessageRecipient) {
          throw new Error('Recipient is not on the XMTP network')
        }

        const conversation = await xmtpClient.conversations.newConversation(recipientAddress)
        onConversationCreated(conversation)
        setRecipientAddress('')
      } catch (error) {
        console.error('Error starting conversation:', error)
        alert(error instanceof Error ? error.message : 'Failed to start conversation. Please check the address and try again.')
      }
    }
  }

  return (
    <div className={styles.newConversation}>
      <input
        type="text"
        placeholder="Enter recipient's Ethereum address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleStartConversation} className={styles.button}>
        Start Conversation
      </button>
    </div>
  )
}