import 'highlight.js/styles/base16/material-palenight.css';
import '@/app/globals.css';

import type {Metadata} from 'next';
import {DM_Mono, DM_Serif_Display, DM_Serif_Text, Sora} from 'next/font/google';

const display = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
});
const sans = Sora({subsets: ['latin'], variable: '--font-sans'});
const serif = DM_Serif_Text({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});
const mono = DM_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'loganz',
  description: "Logan's homepage",
  authors: [{name: 'Logan Zartman'}],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable} font-sans font-normal`}
      >
        {children}
      </body>
    </html>
  );
}