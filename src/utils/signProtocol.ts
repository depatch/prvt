interface AttestationData {
  username: string;
  email: string;
  bio?: string;
  selectedNFT?: string;
}

export async function createAttestation(data: AttestationData): Promise<{ id: string }> {
  // This is a mock implementation. Replace with actual Sign Protocol SDK integration.
  console.log('Creating attestation:', data);
  return { id: `attestation-${Date.now()}` };
}