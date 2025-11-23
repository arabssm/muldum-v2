'use client';

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/hooks/queryClient";
import EmotionRegistry from '@/shared/lib/emotionRegistry';
import GlobalStyle from '@/styles/GlobalStyle';
import styled from '@emotion/styled';
import TopAppBar from '@/shared/ui/topAppBar';
import Footer from '@/shared/ui/footer';
import Toast from '@/shared/ui/toast';
import MobileBlocker from '@/shared/ui/mobileBlocker';
import type { ProvidersProps } from '@/shared/types';
import Head from 'next/head';
import Sentry from "../../sentry";

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
      <MobileBlocker />
      <TopAppBar />

      <QueryClientProvider client={queryClient}>
        <Container>{children}</Container>
        <div id="modal-root"></div>
        <Toast />
      </QueryClientProvider>

      <Footer />
    </EmotionRegistry>
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
  margin-bottom: 4rem;
  box-sizing: border-box;

  @media screen and (max-width: 1620px) {
    width: 1620px;
  }
`;