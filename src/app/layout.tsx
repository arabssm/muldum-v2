import Providers from './providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Muldum',
  description: 'Muldum Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}