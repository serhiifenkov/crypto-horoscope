// app/share/page.tsx
import type { Metadata } from 'next';

const MINIAPP_URL = 'https://crypto-horoscope-beta.vercel.app';

const imageUrl = `${MINIAPP_URL}/api/og?text=Your%20weekly%20crypto%20horoscope%20is%20ready%20%E2%9C%A8`;

const buttonTitle = 'Get your crypto horoscope';

const metaContent = JSON.stringify({
  version: '1',
  imageUrl,
  button: {
    title: buttonTitle,
    action: {
      type: 'launch_miniapp',
      name: 'Weekly Crypto Horoscope',
      url: MINIAPP_URL,
    },
  },
});

export const metadata: Metadata = {
  title: 'Weekly Crypto Horoscope',
  description: 'I just got a weekly crypto horoscope prediction.',
  openGraph: {
    title: 'Weekly Crypto Horoscope',
    description: 'I just got a weekly crypto horoscope prediction.',
    images: [imageUrl],
    url: `${MINIAPP_URL}/share`,
  },
  other: {
    'fc:miniapp': metaContent,
    'fc:frame': metaContent,
  },
};

export default function SharePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05030a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f0ecff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <p>Crypto horoscope share preview.</p>
    </main>
  );
}
