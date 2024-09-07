import React, { useEffect, useState } from 'react';
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
} from "@ethsign/sp-sdk";
import { ethers } from 'ethers';

export const SchemaForm = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [schemaName, setSchemaName] = useState("");
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
    
    // Create schema when creating new clubs. Hide comment for development purpose
    const handleCreateSchema = async () => {
      setLoading(true); // Set loading state to true
      try {
        const createSchemaRes = await client.createSchema({
          name: schemaName,
          data: [{ 
            name: "Title", 
            type: "string" 
          }, { 
            name: "Level", 
            type: "string", 
            enum: ["Basic", "Intermediate", "Expert"] 
          }]
        });
        console.log("Schema created successfully:", createSchemaRes); // Log the response
      } catch (error) {
        console.error("Error creating schema:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };
  
    return (
      <div>
        <div>
          <h2>Create Schema</h2>
          <input
            type="text"
            placeholder="Schema Name"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
            style={{ color: 'black' }}
          />
          <button onClick={handleCreateSchema} disabled={loading}>
            {loading ? "Creating..." : "Create Schema"}
          </button>
        </div>
      </div>
    );
}

export default SchemaForm;