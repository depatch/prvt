import { useState, useEffect } from 'react'
import { useXmtp } from '../hooks/useXMTP'
import MessageInput from './MessageInput'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  conversation: any;
  provider: any;
  address: string | null;
  isConnected: boolean;
}

export default function ChatWindow({ conversation, provider, isConnected, address }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([])
  const { xmtpClient } = useXmtp(provider, isConnected.toString(), address)

//   ```
//   //Start a new conversation
// async function start_a_new_conversation() {
//   const canMessage = await check_if_an_address_is_on_the_network();
//   if (!canMessage) {
//     console.log("Cannot message this address. Exiting...");
//     return;
//   }

//   if (xmtp) {
//     conversation = await xmtp.conversations.newConversation(WALLET_TO);
//     console.log("Conversation created", conversation);
//     console.log(`Conversation created with ${conversation.peerAddress} `);
//   }
// }

// //Send a message
// async function send_a_message(content) {
//   if (conversation) {
//     const message = await conversation.send(content);
//     console.log(`Message sent: "${message.content}"`);
//     return message;
//   }

// }
//   ```

  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      if (conversation) {
        const history = await conversation.messages()
        if (isMounted) setMessages(history)

        const streamMessages = async () => {
          const stream = await conversation.streamMessages()
          for await (const message of stream) {
            if (isMounted) setMessages((prevMessages) => [...prevMessages, message])
          }
        }
        streamMessages()
      }
    }
    loadMessages()

    return () => {
      isMounted = false;
      // If there's a way to cancel the stream, do it here
    }
  }, [conversation])

  const handleSendMessage = async (content: string) => {
    if (conversation && content.trim()) {
      await conversation.send(content)
    }
  }

  if (!conversation) {
    return <div className={styles.noChatSelected}>Select a conversation to start chatting</div>
  }

  console.log(conversation)

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <h2>Chat with {conversation.peerAddress.slice(0, 6)}...{conversation.peerAddress.slice(-4)}</h2>
      </div>
      <div className={styles.messageList}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${xmtpClient && message.senderAddress === xmtpClient.address ? styles.sent : styles.received}`}>
            {message.content}
          </div>
        ))}
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}