import { useEffect, useState, useRef } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useWeb3React } from "@web3-react/core";
import Conversation from "./Conversation";

export default function ActiveSession() {
  const [client, setClient] = useState<Client>();
  const { active, account, library } = useWeb3React();
  const [conversation, setConversation] = useState<Conversation>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(async () => {
    checkIfWalletIsConnected();
  });

  return <Conversation />;
}
