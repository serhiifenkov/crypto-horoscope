// app/layout.tsx
import './globals.css';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({
  weight: '700',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Weekly Crypto Horoscope',
  description: 'Crypto horoscope mini-app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cinzel.className}>
        {children}
      </body>
    </html>
  );
}
