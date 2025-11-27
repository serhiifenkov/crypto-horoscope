import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not set' }, { status: 500 });
  }

  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH&convert=USD`;

  try {
    const resp = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      }
    });
    const data = await resp.json();
    if (!data.data?.BTC || !data.data?.ETH) throw new Error("No data from CMC");

    const btc = data.data.BTC.quote.USD;
    const eth = data.data.ETH.quote.USD;

    const summary = `BTC: $${Math.round(btc.price)} (${btc.percent_change_24h > 0 ? '+' : ''}${btc.percent_change_24h.toFixed(2)}% 24h), ETH: $${Math.round(eth.price)} (${eth.percent_change_24h > 0 ? '+' : ''}${eth.percent_change_24h.toFixed(2)}% 24h)`;

    return NextResponse.json({ summary });
  } catch (err) {
    return NextResponse.json({ error: 'Fetch from CMC failed', details: (err as Error).message }, { status: 500 });
  }
}
