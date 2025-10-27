'use client';

import styled from '@emotion/styled';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import useGoogleLogin from '@/shared/hooks/useGoogleLogin';

export default function LoginModal() {
  const searchParams = useSearchParams();
  const { startGoogleLogin, handleGoogleCallback } = useGoogleLogin();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGoogleCallback(code)
        .then(() => window.location.replace('/'))
    }
  }, [searchParams, handleGoogleCallback]);

  return (
    <Container>
      <Wrapper>
        <Title>로그인</Title>
        <SubText>구글 로그인 시 정보는 자동 저장됩니다</SubText>
      </Wrapper>
      <ButtonGroup>
        <Button onClick={startGoogleLogin}>
          <Image
            src="/assets/google.svg"
            alt="구글 아이콘"
            width={32}
            height={32}
          />
          구글로 로그인하기
        </Button>
        <Button>
          <Image
            src="/assets/guest.svg"
            alt="게스트 아이콘"
            width={32}
            height={32}
          />
          게스트로 둘러보기
        </Button>
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 3rem 3.5rem 3rem;
  gap: 2rem;
  background-color: #fff;
  border-radius: 4px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.6rem;
`;

const Title = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
`;

const SubText = styled.div`
  font-size: 1rem;
  color: #b2b2b2;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const BaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #323232;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const Button = styled(BaseButton)`
  background-color: #fafafa;
  font-weight: 500;

  &:hover {
    background-color: #f8f8f8;
  }
`;