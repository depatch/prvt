import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { query } = req.body

  if (!query) {
    return res.status(400).json({ message: 'Missing query parameter' })
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    const result = JSON.stringify(data.organic);

    return res.status(200).json({ result, error: '' });
  } catch (error) {
    console.error('Serper API error:', error);
    return res.status(500).json({ result: '', error: 'Failed to execute search' });
  }
}