// app/share/page.tsx
import type { Metadata } from 'next';

const MINIAPP_URL = 'https://crypto-horoscope-beta.vercel.app';

type Props = {
  searchParams: { text?: string };
};

export function generateMetadata({ searchParams }: Props): Metadata {
  const rawText =
    searchParams.text || 'Your weekly crypto horoscope is ready ✨';
  const decoded = decodeURIComponent(rawText);
  const short = decoded.slice(0, 120);

  const imageUrl = `${MINIAPP_URL}/api/og?text=${encodeURIComponent(
    decoded,
  )}`;

  const metaContent = JSON.stringify({
    version: '1',
    imageUrl,
    button: {
      title: 'Get your crypto horoscope',
      action: {
        type: 'launch_miniapp',
        name: 'Weekly Crypto Horoscope',
        url: MINIAPP_URL,
      },
    },
  });

  return {
    title: 'Weekly Crypto Horoscope',
    description: short,
    openGraph: {
      title: 'Weekly Crypto Horoscope',
      description: short,
      images: [imageUrl],
      url: `${MINIAPP_URL}/share`,
    },
    other: {
      'fc:miniapp': metaContent,
      'fc:frame': metaContent,
    },
  };
}

export default function SharePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05030a',
      }}
    />
  );
}
