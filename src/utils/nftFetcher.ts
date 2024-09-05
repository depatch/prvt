import axios from 'axios';

const OPENSEA_API_URL = 'https://api.opensea.io/api/v1';

export async function fetchNFTs(address: string) {
  try {
    const response = await axios.get(`${OPENSEA_API_URL}/assets`, {
      params: {
        owner: address,
        order_direction: 'desc',
        offset: '0',
        limit: '20'
      },
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_OPENSEA_API_KEY
      }
    });

    return response.data.assets.map((asset: any) => ({
      id: asset.token_id,
      image: asset.image_url,
      name: asset.name
    }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}