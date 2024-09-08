// import { LitNodeClient } from "@lit-protocol/lit-node-client";
// import { encryptString, decryptToString } from "@lit-protocol/encryption";
// import { AccessControlConditions, EncryptStringRequest } from "@lit-protocol/types";
// import { ethers } from 'ethers';

// const client = new LitNodeClient({ litNetwork: "cayenne" });

// const accessControlConditions: AccessControlConditions = [
//   {
//     contractAddress: '',
//     standardContractType: '',
//     chain: 'ethereum',
//     method: 'eth_getBalance',
//     parameters: [':userAddress', 'latest'],
//     returnValueTest: {
//       comparator: '>=',
//       value: '0',
//     },
//   },
// ];

// Mock encryption/decryption functions using a simple key

const MOCK_KEY = 'hacker';

export function encryptGroupId(groupId: string): { encryptedString: string, encryptedSymmetricKey: string } {
  // Simple XOR encryption for demonstration
  const encryptedString = groupId.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) ^ MOCK_KEY.charCodeAt(0))
  ).join('');

  return {
    encryptedString,
    encryptedSymmetricKey: MOCK_KEY
  };
}

export function decryptGroupId(encryptedString: string, encryptedSymmetricKey: string): string {
  // Simple XOR decryption
  return encryptedString.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) ^ encryptedSymmetricKey.charCodeAt(0))
  ).join('');
}