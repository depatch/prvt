import React, { useEffect, useState } from 'react';
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  delegateSignAttestation,
  delegateSignSchema,
  DataLocationOnChain,
} from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
const privateKey = "0x3fc9d588dad79b434b28997ff9e7641d2c13f03849835082522ea028fb429541"; // Optional



export const AttestationForm = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [schemaName, setSchemaName] = useState("");
  const [attestationData, setAttestationData] = useState({ Title: "", Level: "" }); // State for attestation data
  const [delegationPrivateKey, setDelegationPrivateKey] = useState("");
  const [response, setResponse] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]); // State for recipient addresses

  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.sepolia,
    account: privateKeyToAccount(privateKey), // Optional if you are using an injected provider
  });


  console.log(client)
  
  // Create schema Unhide comment for development purpose
  const handleCreateSchema = async () => {
    try {
      const createSchemaRes = await client.createSchema({
        name: "ClaimStatus", // Ensure this is a string
        data: [{ 
          name: "Title", // Correctly formatted with commas
          type: "string" 
        }, { 
            name: "Builder_Address", // Correctly formatted with commas
            type: "string" 
          }, { 
          name: "Level", 
          type: "string", 
          enum: ["Basic", "Intermediate", "Expert"] // Define choices
        }]
      });
      setResponse(JSON.stringify(createSchemaRes));
    } catch (error) {
      console.error(error);
      setResponse("Error creating schema");
    }
  };

  const handleCreateAttestation = async () => {
    // Initialize an array to collect error messages
    const errors: string[] = [];

    // Prepare the attestation data
    const attestationPayload = {
      schemaId: "0x125", // Required
      recipients: recipients, // Required
      indexingValue: "1", // Optional, can be omitted if not needed
      data: {
        Title: attestationData.Title, // Use state for Title
        Builder_Address: recipients,
        Level: attestationData.Level // Use state for Level
      }, // Required
      dataLocation: DataLocationOnChain.ONCHAIN, // Optional, adjust as needed
    };

    // Log the fields being sent
    console.log("Attestation Payload:", attestationPayload);

    try {
      const createAttestationRes = await client.createAttestation(attestationPayload);
      setResponse(JSON.stringify(createAttestationRes));
    } catch (error) {
      console.error("Error creating attestation:", error);
      setResponse("Error creating attestation");
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
          style={{ color: 'black' }} // Added style for input text color
        />
        <button onClick={handleCreateSchema}>Create Schema</button>
      </div>
      <div>
        <h2>Recipient Addresses</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          onChange={(e) => setRecipients(e.target.value.split(','))} // Allow multiple addresses separated by commas
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
      <button onClick={handleCreateAttestation}>Create Attestation</button>
      <div>
        <h2>Response</h2>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

export default AttestationForm;