import { useState, useEffect } from 'react';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { ethers } from 'ethers';
import { 
  AuthCallbackParams, 
  LitAbility, 
  LitAccessControlConditionResource, 
  LitActionResource, 
  createSiweMessageWithRecaps, 
  generateAuthSig 
} from '@lit-protocol/auth-helpers';

export function useLitProtocol() {
  const [client, setClient] = useState<LitNodeClient | null>(null);

  useEffect(() => {
    const initLitClient = async () => {
      const litClient = new LitNodeClient({ litNetwork: 'serrano' });
      await litClient.connect();
      setClient(litClient);
    };

    initLitClient();
  }, []);

  const encryptBet = async (bet: any, accessControlConditions: any) => {
    if (!client) return null;

    const { ciphertext, dataToEncryptHash } = await LitNodeClient.encryptString(
      JSON.stringify(bet),
      accessControlConditions
    );

    return {
      encryptedBet: ciphertext,
      encryptedSymmetricKey: dataToEncryptHash,
    };
  };

  const decryptBet = async (encryptedBet: string, encryptedSymmetricKey: string, accessControlConditions: any) => {
    if (!client) return null;

    const decryptedString = await client.decrypt({
      accessControlConditions,
      ciphertext: encryptedBet,
      dataToEncryptHash: encryptedSymmetricKey,
      chain: 'chiliz',
    });

    return JSON.parse(decryptedString);
  };

  const getSessionSigs = async (wallet: ethers.Wallet, resources: any[]) => {
    if (!client) return null;

    const sessionSigs = await client.getSessionSigs({
      chain: 'chiliz',
      resourceAbilityRequests: resources,
      authNeededCallback: async (params: AuthCallbackParams) => {
        const authSig = await generateAuthSig(wallet, client, params.uri, params.resourceAbilityRequests || []);
        return authSig;
      }
    });

    return sessionSigs;
  };

  return { encryptBet, decryptBet, getSessionSigs };
}