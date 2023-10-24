import 'highlight.js/styles/base16/material-palenight.css';
import '@/app/globals.css';

import type {Metadata} from 'next';
import {
  DM_Mono,
  DM_Serif_Display,
  DM_Serif_Text,
  Work_Sans,
} from 'next/font/google';

import NavBar from '@/lib/components/NavBar';

const display = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
});
const sans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  style: ['normal', 'italic'],
  weight: 'variable',
});
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
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="min-h-full">
      <body
        className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable} font-sans font-normal min-h-full`}
      >
        <div className="z-10 fixed left-0 right-0 top-8 flex flex-row justify-center">
          <NavBar />
        </div>
        {children}
      </body>
    </html>
  );
}
