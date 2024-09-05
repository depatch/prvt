import { useState, useEffect, useCallback } from 'react';
import { ContractInterface, BrowserProvider, JsonRpcSigner, Contract, parseEther, formatEther } from "ethers";

// This is a placeholder ABI. You'll need to replace it with the actual ABI of your smart contract on the Chiliz blockchain.
const BETTING_CONTRACT_ABI: ContractInterface = [
  // Add your contract ABI here
];

const BETTING_CONTRACT_ADDRESS = 'YOUR_BETTING_CONTRACT_ADDRESS' as const;

export function useChiliz() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const initChiliz = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Use BrowserProvider instead of JsonRpcProvider
        const browserProvider = new BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get the signer
          const userSigner = await browserProvider.getSigner();
          setSigner(userSigner);

          const bettingContract = new Contract(BETTING_CONTRACT_ADDRESS, BETTING_CONTRACT_ABI, userSigner);
          setContract(bettingContract);
        } catch (error) {
          console.error("Failed to initialize Chiliz:", error);
        }
      } else {
        console.error("Ethereum object not found, install MetaMask.");
      }
    };

    initChiliz();
  }, []);

  const getBalance = useCallback(async (address: string) => {
    if (!provider) return 0;
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  }, [provider]);

  const stake = useCallback(async (amount: string) => {
    if (!contract || !signer) throw new Error('Chiliz not initialized');
    const tx = await contract.stake({ value: parseEther(amount) });
    await tx.wait();
    return tx.hash;
  }, [contract, signer]);

  const unstake = useCallback(async (amount: string) => {
    if (!contract || !signer) throw new Error('Chiliz not initialized');
    const tx = await contract.unstake(parseEther(amount));
    await tx.wait();
    return tx.hash;
  }, [contract, signer]);

  const placeBet = useCallback(async (eventId: string, outcome: string, amount: string) => {
    if (!contract || !signer) throw new Error('Chiliz not initialized');
    const tx = await contract.placeBet(eventId, outcome, { value: parseEther(amount) });
    await tx.wait();
    return tx.hash;
  }, [contract, signer]);

  return { getBalance, stake, unstake, placeBet };
}