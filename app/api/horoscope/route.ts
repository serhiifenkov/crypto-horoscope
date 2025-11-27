import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get('sign');

  if (!sign) {
    return NextResponse.json({ error: 'Sign parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/weekly?sign=${sign}`);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from horoscope API' }, { status: 500 });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error fetching horoscope' }, { status: 500 });
  }
}
