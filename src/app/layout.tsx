import '@/app/globals.css';
import 'highlight.js/styles/base16/material-palenight.css';

import type {Metadata} from 'next';
import {Sora} from 'next/font/google';

const sora = Sora({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'loganz',
  description: "Logan's homepage",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${sora.className} font-extralight`}>{children}</body>
    </html>
  );
}
