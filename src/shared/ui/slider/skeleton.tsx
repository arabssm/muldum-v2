"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function SliderSkeleton() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '320px' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Skeleton height="320px" borderRadius="12px" />
        
        {/* 오버레이 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
          borderRadius: '12px'
        }} />
        
        {/* 텍스트 요소들 */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2rem',
          color: 'white'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <Skeleton width="200px" height="32px" />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <Skeleton width="100px" height="16px" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Skeleton width="300px" height="20px" />
          </div>
          <div>
            <Skeleton width="80px" height="24px" />
          </div>
        </div>
        
        {/* 인덱스 */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          color: 'white'
        }}>
          <Skeleton width="40px" height="16px" />
        </div>
      </div>
    </div>
  );
}