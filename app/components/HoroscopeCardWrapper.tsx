// components/HoroscopeCardWrapper.tsx
import React from 'react';
import { CryptoHoroscopeCard } from './CryptoHoroscopeCard';

const signToImage: Record<string, string> = {
  aries: '/cards/aries.png',
  taurus: '/cards/taurus.png',
  gemini: '/cards/gemini.png',
  cancer: '/cards/cancer.png',
  leo: '/cards/leo.png',
  virgo: '/cards/virgo.png',
  libra: '/cards/libra.png',
  scorpio: '/cards/scorpio.png',
  sagittarius: '/cards/sagittarius.png',
  capricorn: '/cards/capricorn.png',
  aquarius: '/cards/aquarius.png',
  pisces: '/cards/pisces.png',
};

type HoroscopeCardWrapperProps = {
  sign: string;
  weekDates: string;
  cryptoText: string;
  onShare?: () => void;
  onClose?: () => void;
};

export function HoroscopeCardWrapper({
  sign,
  weekDates,
  cryptoText,
  onShare,
  onClose,
}: HoroscopeCardWrapperProps) {
  const lower = sign.toLowerCase();
  const image = signToImage[lower] || '/cards/default.png';

  return (
    <CryptoHoroscopeCard
      sign={sign}                 // ← обов’язковий проп
      signIcon={undefined}        // або сюди прокинь getSignIcon(sign)
      weekDates={weekDates}
      cryptoText={cryptoText}
      cardImage={image}
      onShare={onShare}
      onClose={onClose}
    />
  );
}
