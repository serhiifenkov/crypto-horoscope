// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text =
    searchParams.get('text') || 'Your weekly crypto horoscope is ready ✨';

  const cleanText = text.trim().slice(0, 220);

  const bgUrl = new URL('/og-bg.png', request.url).toString();
  const bgRes = await fetch(bgUrl);
  const bgArrayBuffer = await bgRes.arrayBuffer();
  const bgData = new Uint8Array(bgArrayBuffer);
  const bgBase64 = Buffer.from(bgData).toString('base64');

  return new ImageResponse(
    (
      // кореневий flex-контейнер
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'relative',
          backgroundColor: '#05030a',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* фон як один елемент */}
        <img
          src={`data:image/png;base64,${bgBase64}`}
          alt=""
          width={WIDTH}
          height={HEIGHT}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* єдиний дочірній блок із текстом */}
        <div
          style={{
            position: 'relative',
            marginBottom: 40,
            padding: '18px 32px',
            maxWidth: WIDTH - 160,
            borderRadius: 18,
            background: 'rgba(5, 3, 20, 0.8)',
            border: '1px solid rgba(191, 170, 255, 0.6)',
            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.85)',
            color: '#f5f0ff',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span
            style={{
              marginBottom: 10,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#d6c3ff',
            }}
          >
            Weekly Crypto Horoscope
          </span>
          <span
            style={{
              fontSize: 20,
              lineHeight: 1.35,
              whiteSpace: 'pre-wrap',
            }}
          >
            {cleanText}
          </span>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    },
  );
}
