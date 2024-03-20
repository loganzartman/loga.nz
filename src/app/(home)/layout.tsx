import 'highlight.js/styles/base16/material-palenight.css';

import type {Metadata} from 'next';

import NavBar from '@/lib/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://loga.nz'
      : `http://localhost:${process.env.PORT || 3000}`,
  ),
  title: 'loganz',
  description: "Logan's homepage",
  authors: [{name: 'Logan Zartman'}],
  viewport: 'width=device-width, initial-scale=1',
};

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
