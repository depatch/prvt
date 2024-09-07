// src/hooks/useWeb3Auth.ts
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
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

export function useWeb3Auth() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const metamaskAdapter = new MetamaskAdapter({
    clientId,
    sessionTime: 3600, // 1 hour in seconds
    web3AuthNetwork: "sapphire_mainnet",
    chainConfig,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: clientId || "",
          chainConfig,
          privateKeyProvider,
        });
        await getWalletConnectV2Adaptere(web3auth);
        web3auth.configureAdapter(metamaskAdapter);
        setWeb3auth(web3auth);

        await web3auth.initModal();
      } catch (error) {
        console.error("Failed to initialize Web3Auth", error);
      }
    };

    init();
  }, []);

  const getWalletConnectV2Adaptere = async (web3auth: Web3Auth) => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    const defaultWcSettings = await getWalletConnectV2Settings(
      "eip155",
      ["1"],
      "76b1232fbd34d0924ea47d0519bc7844",
    );
    const walletConnectModal = new WalletConnectModal({
      projectId: "76b1232fbd34d0924ea47d0519bc7844",
    });
    const walletConnectV2Adapter = new WalletConnectV2Adapter({
      adapterSettings: { qrcodeModal: walletConnectModal, ...defaultWcSettings.adapterSettings },
      loginSettings: { ...defaultWcSettings.loginSettings },
    });
    web3auth.configureAdapter(walletConnectV2Adapter);
  }

  const connect = useCallback(async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return null;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);

    if (web3authProvider) {
      const ethersProvider = new ethers.BrowserProvider(web3authProvider);
      const signer = await ethersProvider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      setIsConnected(true);
      localStorage.setItem('userAddress', addr);
      return { address: addr };
    }
    return null;
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
    localStorage.removeItem('userAddress');
  }, [web3auth]);

  return { connect, disconnect, isConnected, address, provider };
}