import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { horoscope, market } = await request.json();

    if (!horoscope || !market) {
      return NextResponse.json({ error: 'Horoscope and market required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: `
You are a crypto-trading astrologer writing for a degenerate degen Farcaster crowd.
Reply ONLY with 1 practical, concise action or warning (1 sentence, max 140 chars) for the week, based on the crypto market context and horoscope below.
Reply strictly in English.
Do NOT use hashtags, emoji, symbols, or greetings—only text.
Do NOT repeat original horoscope phrases, do NOT add explanations, intros, or summaries.
Only actionable crypto/DeFi/NFT/altcoin recommendation or warning as for a real trader.
      `.trim()
    },
    {
      role: 'user',
      content: `Market: ${market}. Horoscope: ${horoscope}`
    }
  ],
  temperature: 1.13,
  max_tokens: 60,
});



    const adaptedText = completion.choices[0].message?.content || '';

    return NextResponse.json({ adaptedText });

  } catch (error) {
    return NextResponse.json({ error: 'OpenAI API error', details: (error as Error).message }, { status: 500 });
  }
}
