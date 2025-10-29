"use client";

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const SkeletonBase = styled.div<SkeletonProps>`
  display: inline-block;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: ${props => props.borderRadius || '6px'};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

export const Skeleton = ({ width, height, borderRadius, className, style }: SkeletonProps) => (
  <SkeletonBase 
    width={width} 
    height={height} 
    borderRadius={borderRadius}
    className={className}
    style={style}
  />
);

export const SkeletonText = ({ lines = 1, className }: { lines?: number; className?: string }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        height="16px" 
        width={index === lines - 1 ? '70%' : '100%'}
        style={{ marginBottom: index < lines - 1 ? '8px' : '0' }}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={className} style={{ padding: '16px' }}>
    <Skeleton height="200px" borderRadius="8px" />
    <div style={{ marginTop: '12px' }}>
      <Skeleton height="20px" width="80%" />
      <div style={{ marginTop: '8px' }}>
        <Skeleton height="16px" width="60%" />
      </div>
    </div>
  </div>
);

// 모든 스켈레톤 컴포넌트들을 내보내기
export * from './variants';
export * from './theme';

export default Skeleton;