// src/hooks/useWeb3Auth.ts
import { useState, useEffect, useCallback } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from 'ethers';
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

if (!clientId) {
  throw new Error("Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID");
}

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // mainnet
  rpcTarget: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

export function useWeb3Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: clientId || "",
          chainConfig,
          privateKeyProvider,
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const connect = useCallback(async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    
    if (web3authProvider) {
      const ethersProvider = new ethers.BrowserProvider(web3authProvider);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      setIsConnected(true);
    }
  }, [web3auth]);

  const disconnect = useCallback(async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setAddress(null);
    setIsConnected(false);
  }, [web3auth]);

  return { connect, disconnect, isConnected, address, provider };
}