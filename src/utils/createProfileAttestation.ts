// import { SignProtocolClient, SpMode, EvmChains, DataLocationOnChain } from "@ethsign/sp-sdk";

// const PROFILE_SCHEMA_ID = process.env.NEXT_PUBLIC_PROFILE_SCHEMA_ID;

// export const createProfileAttestation = async (profileData: {
//   username: string;
//   email: string;
//   bio: string;
//   selectedNFT?: string | undefined;
// }) => {
//   const client = new SignProtocolClient(SpMode.OnChain, {
//     chain: EvmChains.sepolia,
//     account: {
//       address: `0x${profileData.email.slice(2)}` as `0x${string}`,
//       signMessage: async (message: string) => {
//         // Implement a proper signing method here
//         console.warn('Message signing not implemented');
//         return '0x';
//       },
//       signTransaction: async (transaction: any) => {
//         // Implement a proper transaction signing method here
//         console.warn('Transaction signing not implemented');
//         return '0x';
//       },
//       signTypedData: async (typedData: any) => {
//         // Implement a proper typed data signing method here
//         console.warn('Typed data signing not implemented');
//         return '0x';
//       }
//     },
//   });

//   try {
//     if (profileData.email) {
//       const createAttestationRes = await client.createAttestation({
//         schemaId: PROFILE_SCHEMA_ID as `0x${string}`,
//         recipients: [profileData.email],
//         indexingValue: Date.now().toString(),
//         data: profileData,
//         dataLocation: DataLocationOnChain.ONCHAIN,
//       });

//       console.log("Profile attestation created successfully:", createAttestationRes);
//       return createAttestationRes;
//     } else {
//       console.error("Email is undefined, cannot create attestation.");
//       throw new Error("Email is undefined");
//     }
//   } catch (error) {
//     console.error("Error creating profile attestation:", error);
//     throw error;
//   }
// };