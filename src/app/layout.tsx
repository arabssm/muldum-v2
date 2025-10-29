'use client';

import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/shared/lib/emotionCache';
import GlobalStyle from '@/styles/GlobalStyle';
import styled from '@emotion/styled';
import TopAppBar from '@/shared/ui/topAppBar';
import { LoadingProvider } from '@/shared/context/LoadingContext';

const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <CacheProvider value={clientSideEmotionCache}>
          <LoadingProvider>
            <GlobalStyle />
            <TopAppBar />
            <Container>{children}</Container>
            <div id="modal-root"></div>
          </LoadingProvider>
        </CacheProvider>
      </body>
    </html>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 90%;
  min-height: 100vh;
  padding: 2.5rem 3rem;
  margin: 0 auto;

  @media screen and (max-width: 1620px) {
    width: 1620px;
  }
`;