'use client';

import { useEffect } from 'react';
import styled from '@emotion/styled';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <ErrorContainer>
      <ErrorContent>
        <ErrorTitle>문제가 발생했습니다</ErrorTitle>
        <ErrorMessage>
          일시적인 오류가 발생했습니다. 다시 시도해주세요.
        </ErrorMessage>
        {process.env.NODE_ENV === 'development' && (
          <ErrorDetails>
            <summary>에러 상세 정보 (개발 모드)</summary>
            <pre>{error.message}</pre>
            {error.stack && <pre>{error.stack}</pre>}
          </ErrorDetails>
        )}
        <ButtonGroup>
          <RetryButton onClick={reset}>다시 시도</RetryButton>
          <HomeButton onClick={() => (window.location.href = '/')}>
            홈으로 이동
          </HomeButton>
        </ButtonGroup>
      </ErrorContent>
    </ErrorContainer>
  );
}

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ErrorContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  summary {
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  pre {
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const RetryButton = styled(Button)`
  background: #667eea;
  color: white;

  &:hover {
    background: #5568d3;
  }
`;

const HomeButton = styled(Button)`
  background: #48bb78;
  color: white;

  &:hover {
    background: #38a169;
  }
`;
