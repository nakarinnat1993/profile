import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { JetBrains_Mono, Kanit } from 'next/font/google';
import './globals.css';

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Jack -- 3D Creator',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${kanit.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
