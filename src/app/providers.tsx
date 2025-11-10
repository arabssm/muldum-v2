'use client';

import EmotionRegistry from '@/shared/lib/emotionRegistry';
import GlobalStyle from '@/styles/GlobalStyle';
import styled from '@emotion/styled';
import TopAppBar from '@/shared/ui/topAppBar';
import Footer from '@/shared/ui/footer';
import Toast from '@/shared/ui/toast';
import type { ProvidersProps } from '@/shared/types';
import Head from 'next/head';

export default function Providers({ children }: ProvidersProps) {
  return (
    <EmotionRegistry options={{ key: 'css' }}>
      <Head>
        <title>물듬</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/muldum.svg" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-647YRBZSPE"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-647YRBZSPE');
            `,
          }}
        />
      </Head>

      <GlobalStyle />
      <TopAppBar />
      <Container>{children}</Container>
      <div id="modal-root"></div>
      <Toast />
      <Footer />
    </EmotionRegistry>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 90%;
  min-height: calc(100vh - 5rem);
  padding: 2.5rem 3rem;
  margin: 0 auto;
  box-sizing: border-box;
  @media screen and (max-width: 1620px) {
    width: 1620px;
  }
`;