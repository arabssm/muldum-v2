'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export default function Loading() {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>로딩 중...</LoadingText>
    </LoadingContainer>
  );
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #666;
`;
