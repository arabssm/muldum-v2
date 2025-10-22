"use client"

import GlobalStyle from "@/styles/GlobalStyle";
import styled from "@emotion/styled";
import TopAppBar from "@/components/topAppBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalStyle />
        <TopAppBar />
        <Container>
          {children}
        </Container>
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

  @media screen and (max-width: 1620px){
    width: 1620px;
  }
`;