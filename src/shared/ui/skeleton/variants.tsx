"use client";

import styled from '@emotion/styled';
import { Skeleton } from './index';

// 카드 형태 스켈레톤
export const SkeletonCard = styled.div`
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

// 리스트 아이템 스켈레톤
export const SkeletonListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  
  &:last-child {
    border-bottom: none;
  }
`;

// 헤더 스켈레톤
export const SkeletonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

// 그리드 컨테이너
export const SkeletonGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 텍스트 블록 스켈레톤
interface SkeletonTextBlockProps {
    lines?: number;
    className?: string;
}

export const SkeletonTextBlock = ({ lines = 3, className }: SkeletonTextBlockProps) => (
    <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
            <div key={index} style={{ marginBottom: index < lines - 1 ? '8px' : '0' }}>
                <Skeleton
                    height="16px"
                    width={
                        index === 0 ? '90%' :
                            index === lines - 1 ? '60%' : '100%'
                    }
                />
            </div>
        ))}
    </div>
);

// 아바타 스켈레톤
export const SkeletonAvatar = ({ size = '40px' }: { size?: string }) => (
    <Skeleton width={size} height={size} borderRadius="50%" />
);

// 버튼 스켈레톤
export const SkeletonButton = ({ width = '100px', height = '40px' }: { width?: string; height?: string }) => (
    <Skeleton width={width} height={height} borderRadius="8px" />
);

// 이미지 스켈레톤
export const SkeletonImage = ({ width = '100%', height = '200px', borderRadius = '8px' }: {
    width?: string;
    height?: string;
    borderRadius?: string;
}) => (
    <Skeleton width={width} height={height} borderRadius={borderRadius} />
);