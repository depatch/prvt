import React, { useEffect, useState } from 'react';
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  DataLocationOnChain,
} from "@ethsign/sp-sdk";
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any; // or a more specific type if known
  }
}

const clubId = "0x1b4"; // Define clubId when a club is created
const indexingValue = (Math.floor(Math.random() * 10) + 1).toString(); // Index is used to catogerize attestations, meaning that you can make subgroup in a club(or just make it random

export const AttestationForm = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [attestationData, setAttestationData] = useState({ Title: "", Level: "" }); // State for attestation data
  const [recipients, setRecipients] = useState<string[]>([]); // State for recipient addresses
  const [loading, setLoading] = useState(false); // Optional loading state

  useEffect(() => {
    const getAccount = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
        } catch (error) {
          console.error("Error getting account:", error);
        }
      } else {
        console.error("Please install MetaMask!");
      }
    };

    getAccount();
  }, []);

  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.sepolia,
    account: account ? { address: account } : undefined, // Use the account address
  });
  
  const handleCreateAttestation = async () => {
    setLoading(true); // Set loading state to true
    // Initialize an array to collect error messages
    const errors: string[] = [];

    // Prepare the attestation data
    const attestationPayload = {
      schemaId: clubId, 
      recipients: recipients, 
      indexingValue: indexingValue,
      data: {
        Title: attestationData.Title,
        Level: attestationData.Level 
      }, 
      dataLocation: DataLocationOnChain.ONCHAIN,
    };

    // Log the fields being sent
    console.log("Attestation Payload:", attestationPayload);

    try {
      const createAttestationRes = await client.createAttestation(attestationPayload);
    } catch (error) {
      console.error("Error creating attestation:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <div>
        <h2>Recipient Addresses</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          onChange={(e) => setRecipients(e.target.value.split(','))}
          style={{ color: 'black' }} 
        />
      </div>
      <div>
        <h2>Attestation Data</h2>
        <input
          type="text"
          placeholder="Title"
          value={attestationData.Title}
          onChange={(e) => setAttestationData({ ...attestationData, Title: e.target.value })}
          style={{ color: 'black' }} 
        />
        <select
          value={attestationData.Level}
          onChange={(e) => setAttestationData({ ...attestationData, Level: e.target.value })}
          style={{ color: 'black' }} 
        >
          <option value="">Select Level</option> // Placeholder option
          <option value="Basic">Basic</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
      <button onClick={handleCreateAttestation} disabled={loading}>
            {loading ? "Attesting..." : "Attest User"}
          </button>
    </div>
  );
};

export default AttestationForm;