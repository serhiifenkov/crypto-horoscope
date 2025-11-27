import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sign = req.query.sign;
  if (!sign || typeof sign !== 'string') {
    res.status(400).json({ error: 'Sign parameter is required' });
    return;
  }

  try {
    const response = await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/weekly?sign=${sign}`);
    if (!response.ok) throw new Error('Failed to fetch from horoscope API');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching horoscope' });
  }
}
