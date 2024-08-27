import { useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useWeb3React } from "@web3-react/core";
import { Conversation } from "./Conversation";

export default function ActiveSession() {
  const [client, setClient] = useState<Client | null>(null);
  const { active, account, library } = useWeb3React();
  const [conversation, setConversation] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initXmtp = async () => {
      if (active && account && library) {
        try {
          const xmtp = await Client.create(library.getSigner());
          setClient(xmtp);
          setIsConnected(true);
        } catch (error) {
          console.error("Error initializing XMTP client:", error);
        }
      }
    };

    initXmtp();
  }, [active, account, library]);

  const startConversation = async (peerAddress: string) => {
    if (client) {
      const conversation =
        await client.conversations.newConversation(peerAddress);
      setConversation(conversation);
    }
  };

  return (
    <div>
      {isConnected ? (
        conversation ? (
          <Conversation conversation={conversation} />
        ) : (
          <div>
            <h2>Start a conversation</h2>
            <input
              type="text"
              placeholder="Enter peer address"
              onChange={(e) => startConversation(e.target.value)}
            />
          </div>
        )
      ) : (
        <div>Please connect your wallet</div>
      )}
    </div>
  );
}
