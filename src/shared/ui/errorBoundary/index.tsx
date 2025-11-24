'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from '@emotion/styled';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Sentry나 다른 에러 로깅 서비스로 전송 가능
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorTitle>앗! 문제가 발생했습니다</ErrorTitle>
            <ErrorMessage>
              일시적인 오류가 발생했습니다. 페이지를 새로고침하거나 홈으로 돌아가주세요.
            </ErrorMessage>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>에러 상세 정보 (개발 모드)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.error.stack}</pre>
              </ErrorDetails>
            )}
            <ButtonGroup>
              <ResetButton onClick={() => window.location.reload()}>
                새로고침
              </ResetButton>
              <HomeButton onClick={this.handleReset}>
                홈으로 이동
              </HomeButton>
            </ButtonGroup>
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
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

const ResetButton = styled(Button)`
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

export default ErrorBoundary;
