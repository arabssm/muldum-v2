"use client";

import { useRouter } from "next/navigation";
import DinoGame from '@/shared/ui/notFound';
import styled from "@emotion/styled";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container>
      <DinoGame />
      <Group>
        <Title>페이지를 찾을 수 없습니다</Title>
        <SubTitle>잠시 게임을 즐기거나, 이전 페이지로 돌아가세요</SubTitle>
        <BackButton onClick={() => router.back()}>이전 페이지로 이동</BackButton>
      </Group>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 38vh;
  margin-top: 12rem;
`;

const Font = `
  @font-face {
    font-family: 'PfStardust30';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2506-1@1.0/PFStardustBold.woff2') format('woff2');
    font-weight: 600;
    font-display: swap;
  }
`;

const Title = styled.div`
  ${Font}
  display: flex;
  font-size: 2.25rem;
  font-family: 'PfStardust30', sans-serif;
`;

const SubTitle = styled.div`
  ${Font}
  display: flex;
  font-size: 1.25rem;
  color: #B2B2B2;
  font-family: 'PfStardust30', sans-serif;
`;

const BackButton = styled.button`
  ${Font}
  margin-top: 2rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #222;
  color: white;
  font-family: 'PfStardust30', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #444;
  }
`;

const Group = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
`;