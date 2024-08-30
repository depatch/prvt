import { useState, useEffect } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const ConnectWallet = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: "YOUR_WEB3AUTH_CLIENT_ID", // get it from Web3Auth Dashboard
          web3AuthNetwork: "testnet",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1", // mainnet
            rpcTarget: "https://rpc.ankr.com/eth",
          },
        });

        setWeb3auth(web3auth);
        await web3auth.initModal();
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const handleConnect = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    try {
      const provider = await web3auth.connect();
      setIsConnected(true);
      console.log("Connected to Web3Auth", provider);
    } catch (error) {
      console.error("Error connecting to Web3Auth", error);
    }
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      disabled={!web3auth}
    >
      {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWallet;
