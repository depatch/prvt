'use client';

import { useState, useEffect, useCallback } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { ethers } from 'ethers';
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { WalletConnectModal } from "@walletconnect/modal";
import {
  getWalletConnectV2Settings,
  WalletConnectV2Adapter,
} from "@web3auth/wallet-connect-v2-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

if (!clientId) {
  throw new Error("Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID");
}

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // mainnet
  rpcTarget: "https://ethereum.blockpi.network/v1/rpc/public",
  clientId: clientId,
  sessionTime: 3600, // 1 hour in seconds
  web3AuthNetwork: "sapphire_mainnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
  }
};

export function useWeb3Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWalletConnectV2Adapter = useCallback(async () => {
    const defaultWcSettings = await getWalletConnectV2Settings(
      "eip155",
      ["1"],
      "76b1232fbd34d0924ea47d0519bc7844"
    );
    const walletConnectModal = new WalletConnectModal({
      projectId: "76b1232fbd34d0924ea47d0519bc7844",
    });
    return new WalletConnectV2Adapter({
      adapterSettings: { qrcodeModal: walletConnectModal, ...defaultWcSettings.adapterSettings },
      loginSettings: { ...defaultWcSettings.loginSettings },
    });
  }, []);

  const initializeWeb3Auth = useCallback(async () => {
    try {
      const web3auth = new Web3Auth({
        clientId: clientId || "",
        chainConfig,
        web3AuthNetwork: "sapphire_mainnet",
        privateKeyProvider: new EthereumPrivateKeyProvider({ config: { chainConfig } })
      });

      const metamaskAdapter = new MetamaskAdapter({ clientId });
      web3auth.configureAdapter(metamaskAdapter);

      const walletConnectV2Adapter = await getWalletConnectV2Adapter();
      web3auth.configureAdapter(walletConnectV2Adapter);

      await web3auth.initModal();
      setWeb3auth(web3auth);

      if (web3auth.connected) {
        const web3authProvider = web3auth.provider;
        setProvider(web3authProvider);

        if (web3authProvider) {
          const ethersProvider = new ethers.BrowserProvider(web3authProvider);
          const signer = await ethersProvider.getSigner();
          const addr = await signer.getAddress();
          setAddress(addr);
          setIsConnected(true);
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing Web3Auth:", error);
      setError("Failed to initialize Web3Auth. Please try again.");
      setIsInitialized(true);
    }
  }, [getWalletConnectV2Adapter]);

  useEffect(() => {
    initializeWeb3Auth();
  }, [initializeWeb3Auth]);

  const connect = useCallback(async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      setError("Web3Auth not initialized. Please try again.");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);

      if (web3authProvider) {
        const ethersProvider = new ethers.BrowserProvider(web3authProvider);
        const signer = await ethersProvider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);
        setIsConnected(true);
        setError(null);
      }
    } catch (error) {
      console.error("Error connecting to Web3Auth:", error);
      setError("Failed to connect. Please try again.");
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

  return { 
    connect, 
    disconnect, 
    isConnected, 
    address, 
    provider,
    isInitialized,
    error
  };
}