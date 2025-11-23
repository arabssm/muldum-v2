'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';

export default function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 1620;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isMobile) return null;

  return (
    <Overlay>
      <Content>
        <LogoWrapper>
          <Image src="/assets/araLogo.svg" alt="Logo" width={200} height={200} />
        </LogoWrapper>
        <Title>PC에서 접속해주세요</Title>
        <Message>
          이 서비스는 PC 환경에 최적화되어 있습니다.
          <br />
          더 나은 경험을 위해 데스크톱에서 접속해주세요.
        </Message>
      </Content>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Content = styled.div`
  text-align: center;
  padding: 2rem;
  max-width: 500px;
`;

const LogoWrapper = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  font-size: 1.25rem;
  color: #666;
  line-height: 1.8;
`;
