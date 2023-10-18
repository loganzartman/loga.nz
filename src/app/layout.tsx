import '@/app/globals.css';
import 'highlight.js/styles/base16/material-palenight.css';

import type {Metadata} from 'next';
import {DM_Mono, DM_Serif_Display, Sora} from 'next/font/google';

const sans = Sora({subsets: ['latin'], variable: '--font-sans'});
const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
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
        className={`${sans.variable} ${serif.variable} ${mono.variable} font-sans font-extralight`}
      >
        {children}
      </body>
    </html>
  );
}
