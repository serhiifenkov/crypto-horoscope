// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
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

  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    if (originalHoroscope && marketContext) {
      fetchCryptoAdaptation(originalHoroscope, marketContext);
    }
  }, [originalHoroscope, marketContext]);

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      setProgress(0);
      return;
    }

    setLoadingStep(1);
    setProgress(0);

    const start = performance.now();
    const duration = 7000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const clamped = Math.min(elapsed, duration);
      const ratio = clamped / duration;
      const pct = Math.round(ratio * 100);
      setProgress(pct);

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

    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = getCardImage(sign);
    }

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
        {/* ... твій існуючий JSX без змін ... */}

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
    await sdk.actions.composeCast({
      text: cryptoHoroscope,
      embeds: [window.location.href],
      close: true,
    });
  }}
  onClose={() => setShowCard(false)}
/>

          </div>
        )}
      </div>
    </main>
  );
}
