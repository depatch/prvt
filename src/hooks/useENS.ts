import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useENS(address: string) {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    async function lookupENS() {
      if (!address) return;

      try {
        const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        const name = await provider.lookupAddress(address);
        setEnsName(name);

        // Check if the ENS name is considered "premium"
        // This is a placeholder logic; you might want to define your own criteria
        if (name) {
          const isPremium = name.length <= 4; // Example: consider names with 4 or fewer characters as premium
          setIsPremium(isPremium);
        }
      } catch (error) {
        console.error('Error looking up ENS name:', error);
      }
    }

    lookupENS();
  }, [address]);

  return { ensName, isPremium };
}