import { Network, Alchemy } from 'alchemy-sdk';

// Configure Alchemy SDK
const settings = {
  apiKey: "23d9BCjFKH8YDo94F2NwN-RJ_A2zEISt",
  network: Network.OPT_MAINNET,
};

console.log('Alchemy API Key:', settings.apiKey ? 'Set (not shown for security)' : 'Not set');
console.log('API Key length:', settings.apiKey?.length || 0);

const alchemy = new Alchemy(settings);

export async function fetchNFTs(address) {
  if (!settings.apiKey) {
    throw new Error('Alchemy API key is not set');
  }

  try {
    console.log('Fetching NFTs for address:', address);
    const nftsForOwner = await alchemy.nft.getNftsForOwner(address);
    console.log('NFTs fetched successfully');
    console.log(nftsForOwner);

    const nfts = nftsForOwner.ownedNfts.map(nft => ({
      id: `${nft.contract.address}-${nft.tokenId}`, // Add this line
      name: nft.title || `NFT #${nft.tokenId}`,
      image: nft.image.cachedUrl || 'https://via.placeholder.com/100?text=No+Image',
    }));

    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
}