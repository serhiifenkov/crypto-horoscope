// app/page.tsx
'use client';

import { sdk } from '@farcaster/miniapp-sdk';
// решта імпортів


import { useState, useEffect } from 'react';
import { CryptoHoroscopeCard } from './components/CryptoHoroscopeCard';

export default function HomePage() {
  const [sign, setSign] = useState('');
  const [originalHoroscope, setOriginalHoroscope] = useState('');
  const [cryptoHoroscope, setCryptoHoroscope] = useState('');
  const [marketContext, setMarketContext] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCard, setShowCard] = useState(false);

  // прогрес-бар
  const [loadingStep, setLoadingStep] = useState(0); // 0..3
  const [progress, setProgress] = useState(0);       // 0..100

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' },   { value: 4, label: 'April' },
    { value: 5, label: 'May' },     { value: 6, label: 'June' },
    { value: 7, label: 'July' },    { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  const daysInMonth = (m: number) => {
    if ([1, 3, 5, 7, 8, 10, 12].includes(m)) return 31;
    if ([4, 6, 9, 11].includes(m)) return 30;
    return 29;
  };

  const getZodiacSignFromDate = (month: number, day: number) => {
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    return '';
  };

  function getCardImage(sign: string): string {
  const map: Record<string, string> = {
    Aries: '/cards/aries.webp',
    Taurus: '/cards/taurus.webp',
    Gemini: '/cards/gemini.webp',
    Cancer: '/cards/cancer.webp',
    Leo: '/cards/leo.webp',
    Virgo: '/cards/virgo.webp',
    Libra: '/cards/libra.webp',
    Scorpio: '/cards/scorpio.webp',
    Sagittarius: '/cards/sagittarius.webp',
    Capricorn: '/cards/capricorn.webp',
    Aquarius: '/cards/aquarius.webp',
    Pisces: '/cards/pisces.webp',
  };
  return map[sign] ?? '/cards/default.webp';
}


  function getSignIcon(sign: string) {
    const icons: { [key: string]: string } = {
      Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
      Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
      Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
    };
    return icons[sign] || '';
  }

  // MARKET DATA
  const fetchMarketContext = async () => {
    try {
      const response = await fetch('/api/market');
      const data = await response.json();
      if (data.summary) setMarketContext(data.summary);
      else setMarketContext('');
    } catch {
      setMarketContext('');
    }
  };

  // HOROSCOPE DATA
  const fetchWeeklyHoroscope = async (sign: string) => {
    try {
      const response = await fetch(`/api/horoscope?sign=${sign.toLowerCase()}`);
      if (!response.ok) throw new Error('Failed to fetch horoscope');
      const result = await response.json();
      if (result.success && result.data && result.data.horoscope_data) {
        setOriginalHoroscope(result.data.horoscope_data);
      } else {
        setError('Horoscope not found');
        setLoading(false);
      }
    } catch {
      setError('Failed to load horoscope');
      setLoading(false);
    }
  };

  // CRYPTO ADAPT
  const fetchCryptoAdaptation = async (text: string, market: string) => {
    try {
      const response = await fetch('/api/crypto-adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horoscope: text, market }),
      });
      if (!response.ok) throw new Error('Failed to adapt horoscope');
      const data = await response.json();
      if (data.adaptedText) setCryptoHoroscope(data.adaptedText);
      else setCryptoHoroscope('Failed to adapt horoscope text');
    } catch {
      setCryptoHoroscope('Error during adaptation');
    }
  };

  useEffect(() => {
  sdk.actions.ready().catch(() => {});
}, []);


  // як тільки є оригінал + контекст — запускаємо адаптацію
  useEffect(() => {
    if (originalHoroscope && marketContext) {
      fetchCryptoAdaptation(originalHoroscope, marketContext);
    }
  }, [originalHoroscope, marketContext]);

  // 6-секундний плавний прогрес з етапами
  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      setProgress(0);
      return;
    }

    setLoadingStep(1);
    setProgress(0);

    const start = performance.now();
    const duration = 7000; // 6 секунд

    const tick = (now: number) => {
      const elapsed = now - start;
      const clamped = Math.min(elapsed, duration);
      const ratio = clamped / duration; // 0..1
      const pct = Math.round(ratio * 100);
      setProgress(pct);

      // 0–1.5, 1.5–3, 3–4.5, 4.5–7 сек
  if (clamped < 1400) setLoadingStep(1);
  else if (clamped < 2800) setLoadingStep(2);
  else if (clamped < 5000) setLoadingStep(3);
  else setLoadingStep(4);

      if (clamped < duration && loading) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loading]);

  // показуємо картку лише коли прогрес 100% і є cryptoHoroscope
  useEffect(() => {
    if (cryptoHoroscope && loading && progress === 100) {
      setLoading(false);
      setShowCard(true);
      setLoadingStep(0);
    }
  }, [cryptoHoroscope, loading, progress]);

  const loadingStepText = (() => {
  if (!loadingStep) return '';
  if (loadingStep === 1) return 'Fetching your weekly horoscope...';
  if (loadingStep === 2) return 'Fetching market conditions and trends...';
  if (loadingStep === 3) return 'Dialing retrograde Mercury for advice...';
  return 'Generating AI-powered crypto forecast...';
})();


  const handleBirthdayChange = (newMonth: number, newDay: number) => {
    setMonth(newMonth.toString());
    setDay(newDay.toString());
    const zodiac = getZodiacSignFromDate(newMonth, newDay);
    setSign(zodiac);
  };

  const handleGenerate = async () => {
    if (!sign) {
      setError('Please select a sign or birthday first.');
      return;
    }
    setError('');
    setShowCard(false);
    setCryptoHoroscope('');
    setOriginalHoroscope('');
    setMarketContext('');

    // прелоад фону картки
  if (typeof window !== 'undefined') {
    const img = new window.Image();
    img.src = getCardImage(sign);
  }

    // скидати прогрес перед стартом
    setLoadingStep(0);
    setProgress(0);
    setLoading(true);

    await Promise.all([
      fetchMarketContext(),
      fetchWeeklyHoroscope(sign),
    ]);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05030a',
        padding: 12,
      }}
    >
      <div
        style={{
          width: 360,
          maxWidth: '100%',
          borderRadius: 24,
          padding: 20,
          background: '#05030a',
          border: '1px solid #26222f',
        }}
      >
                        {/* Title */}
        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              marginBottom: 8,
              color: '#f0ecff',
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Weekly crypto horoscope
          </p>
          <div
            style={{
              height: 1,
              width: '60%',
              margin: '0 auto',
              background:
                'linear-gradient(90deg, transparent, rgba(240,236,255,0.35), transparent)',
            }}
          />
        </div>

        {/* Select your sign */}
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              marginBottom: 10,
              color: '#f0ecff',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              textAlign: 'center',
              opacity: 0.9,
            }}
          >
            Select your sign
          </p>


          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            {zodiacSigns.map((signItem) => (
              <button
                key={signItem}
                onClick={() => {
                  setSign(signItem);
                  setMonth('');
                  setDay('');
                  setCryptoHoroscope('');
                  setOriginalHoroscope('');
                  setShowCard(false);
                }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  borderRadius: 999,
                  border: '1px solid #444',
                  background:
                    sign === signItem ? '#7F5AFF' : 'rgba(0,0,0,0.35)',
                  color: '#eee',
                  fontSize: 12,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {signItem}
              </button>
            ))}
          </div>
        </div>

        {/* Or pick your birthday */}
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              marginBottom: 8,
              color: '#f0ecff',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Or pick your birthday
          </p>

          <div style={{ textAlign: 'center' }}>
            <select
              value={month}
              onChange={(e) => {
                const m = Number(e.target.value);
                const d = day ? Number(day) : 1;
                setMonth(e.target.value);
                const maxDay = daysInMonth(m);
                if (d > maxDay) {
                  handleBirthdayChange(m, maxDay);
                } else {
                  handleBirthdayChange(m, d);
                }
              }}
              style={{
                padding: '8px 32px 8px 16px',
                marginRight: 10,
                fontSize: 12,
                borderRadius: 999,
                border: '1px solid #444',
                background: '#090712',
                color: '#f0ecff',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23f0ecff' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '10px 6px',
              }}
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={day}
              onChange={(e) => {
                const d = Number(e.target.value);
                const m = month ? Number(month) : 1;
                setDay(e.target.value);
                handleBirthdayChange(m, d);
              }}
              style={{
                padding: '8px 32px 8px 16px',
                fontSize: 12,
                borderRadius: 999,
                border: '1px solid #444',
                background: '#090712',
                color: '#f0ecff',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23f0ecff' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '10px 6px',
              }}
              disabled={!month}
            >
              <option value="">Day</option>
              {month &&
                Array.from(
                  { length: daysInMonth(Number(month)) },
                  (_, i) => i + 1,
                ).map((dayOption) => (
                  <option key={dayOption} value={dayOption}>
                    {dayOption}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: 'red', fontSize: 13, textAlign: 'center' }}>
            {error}
          </p>
        )}

        {/* Слот під прогрес-бар */}
        <div style={{ minHeight: 32, marginTop: 8, marginBottom: 12 }}>
          {loading && (
            <>
              <div
                style={{
                  height: 6,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg,#7F5AFF,#B794FF)',
                    transition: 'width 0.15s linear',
                  }}
                />
              </div>
              <p
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: '#d0c8ff',
                  textAlign: 'center',
                }}
              >
                {loadingStepText}
              </p>
            </>
          )}
        </div>

        {/* Generate button */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: '10px 18px',
              width: '100%',
              maxWidth: 280,
              borderRadius: 999,
              border: 0,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
              background: 'linear-gradient(90deg,#7F5AFF,#B794FF)',
              color: '#06030e',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.7,
              textTransform: 'uppercase',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.08), 0 10px 26px rgba(0,0,0,0.7)',
            }}
          >
            Generate
          </button>
        </div>

        {/* поп-ап картка поверх */}
        {cryptoHoroscope && !loading && showCard && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
            }}
          >
        <CryptoHoroscopeCard
  sign={sign}
  signIcon={getSignIcon(sign)}
  cryptoText={cryptoHoroscope}
  cardImage={getCardImage(sign)}
  onShare={async () => {
    try {
      const baseUrl = 'https://crypto-horoscope-beta.vercel.app/share';
      const shareUrl = `${baseUrl}?text=${encodeURIComponent(
        cryptoHoroscope + ' ✨',
      )}`;

      console.log('SHARE URL >>>', shareUrl);

      await sdk.actions.composeCast({
        text: 'I just got a weekly crypto horoscope prediction ✨',
        embeds: [shareUrl],
      });
    } catch (e) {
      console.error('composeCast error', e);
    }
  }}
  onClose={() => setShowCard(false)}
/>

          </div>
        )}
      </div>
    </main>
  );
}
