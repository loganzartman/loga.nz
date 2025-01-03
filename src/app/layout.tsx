import '@/app/globals.css';

import {
  DM_Mono,
  DM_Serif_Display,
  DM_Serif_Text,
  Work_Sans,
} from 'next/font/google';

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
