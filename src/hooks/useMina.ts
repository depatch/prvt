import { useState, useEffect } from 'react';
import { Mina, PublicKey, PrivateKey, Field } from 'o1js';

export function useMina() {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [privateKey, setPrivateKey] = useState<PrivateKey | null>(null);

  useEffect(() => {
    const connectToMina = async () => {
      const Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');
      Mina.setActiveInstance(Berkeley);
      const { publicKey, privateKey } = await generateAccount();
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      setIsConnected(true);
    };

    connectToMina();
  }, []);

  const generateAccount = async () => {
    const privateKey = PrivateKey.random();
    const publicKey = privateKey.toPublicKey();
    return { privateKey, publicKey };
  };

  const createZkProof = async (gameState: number) => {
    if (!publicKey || !privateKey) return null;

    // This is a simplified example. In a real implementation, you'd define a more complex circuit.
    class GameCircuit extends Mina.SmartContract {
      @Mina.method verifyGameState(state: Field) {
        state.assertGreaterThan(Field(0));
      }
    }

    const zkApp = new GameCircuit(publicKey);
    const tx = await Mina.transaction(publicKey, () => {
      zkApp.verifyGameState(Field(gameState));
    });
    await tx.prove();
    return tx;
  };

  return { isConnected, publicKey, createZkProof };
}