"use client"

import GlobalStyle from "@/styles/GlobalStyle";
import styled from "@emotion/styled";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalStyle />
      <body>
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
  width: 100%;
  max-width: 90%;
  min-height: 100vh;
  padding: 4rem 1rem;
  margin: 0 auto;
`;