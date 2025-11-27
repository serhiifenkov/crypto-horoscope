// components/CryptoHoroscopeCard.tsx
import React from 'react';
import Image from 'next/image';

export type CryptoHoroscopeCardProps = {
  sign: string;              // Назва знаку, напр. 'Leo'
  signIcon?: string;         // Символ типу ♌ (необов'язково)
  weekDates?: string;        // Напр. '25.11 – 01.12' (необов'язково)
  cryptoText: string;        // Текст адаптованого крипто-гороскопу
  cardImage?: string;        // Шлях до PNG-картки знаку, напр. '/leo.png'
  onShare?: () => void;      // Клік по кнопці Share
  onClose?: () => void;      // Клік по кнопці Close
};

export function CryptoHoroscopeCard({
  sign,
  signIcon,
  weekDates,
  cryptoText,
  cardImage = '/cards/default.webp',
  onShare,
  onClose,
}: CryptoHoroscopeCardProps) {
  const normalizedText =
    cryptoText.trim().endsWith('.')
      ? cryptoText.trim().slice(0, -1)
      : cryptoText.trim();

  return (
    <div
      style={{
        width: 300,
        height: 480,
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
        margin: '32px auto',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.65)',
        backgroundColor: '#05030a',
      }}
    >
      {/* Фонова картка знаку */}
     <Image
  src={cardImage}
  alt={sign}
  fill
  sizes="300px"
  preload
  fetchPriority="high"
  style={{ objectFit: 'cover' }}
/>


      {/* Нижній блок із текстом прогнозу */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 80, // трохи вище, бо під ним дві кнопки
          padding: '12px 14px',
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.48)',
          backdropFilter: 'blur(4px)',
          color: '#1b1020',
          fontSize: 13,
          lineHeight: 1.35,
          maxHeight: 200,
          overflowY: 'auto',
        }}
      >
        {/* Заголовок блоку прогнозу */}
        <div
          style={{
            marginBottom: 10,
            paddingBottom: 6,
            borderBottom: '1px solid rgba(0, 0, 0, 0.18)',
          }}
        >
          <span
            style={{
              display: 'block',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: '#2b1320',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Weekly Crypto Horoscope
          </span>
        </div>

        <div
          style={{
            textAlign: 'center',
          }}
        >
          {normalizedText}
        </div>
      </div>

      {/* Кнопки Close / Share */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          display: 'flex',
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            background: '#24212b',
            color: '#e2e2e2',
            border: 0,
            borderRadius: 16,
            fontSize: 14,
            fontWeight: 600,
            padding: '8px 0',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background .15s, transform .1s',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04), 0 6px 14px rgba(0,0,0,0.5)',
          }}
        >
          Close
        </button>

        <button
          type="button"
          onClick={onShare}
          style={{
            flex: 1,
            background: 'linear-gradient(180deg,#7F5AFF,#5a3adf)',
            color: '#f4f4f4',
            border: 0,
            borderRadius: 16,
            fontSize: 14,
            fontWeight: 600,
            padding: '8px 0',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background .15s, transform .1s',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.08), 0 8px 20px rgba(0,0,0,0.6)',
          }}
        >
          Share
        </button>
      </div>
    </div>
  );
}
