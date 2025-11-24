'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';

const BYPASS_KEY = 'mobile_blocker_bypass';

export default function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isBypassed, setIsBypassed] = useState(false);

  useEffect(() => {
    // 로컬스토리지에서 우회 상태 확인
    const bypassed = localStorage.getItem(BYPASS_KEY) === 'true';
    setIsBypassed(bypassed);

    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
      const isPortrait = window.innerHeight > window.innerWidth;
      
      setIsMobile(isMobileDevice || isPortrait);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      // 5번 클릭 시 우회 활성화
      localStorage.setItem(BYPASS_KEY, 'true');
      setIsBypassed(true);
      setClickCount(0);
    }

    // 2초 후 카운트 리셋
    setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  // 우회 상태이거나 모바일이 아니면 표시 안 함
  if (!isMobile || isBypassed) return null;

  return (
    <Overlay>
      <Content>
        <LogoWrapper onClick={handleLogoClick}>
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
  position: relative;
  user-select: none;
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
