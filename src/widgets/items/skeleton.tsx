"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function ItemsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 그룹 선택 버튼들 스켈레톤 */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} width="120px" height="40px" borderRadius="8px" />
        ))}
      </div>

      {/* 메시지 영역 스켈레톤 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '1rem',
        minHeight: '300px'
      }}>
        <Skeleton width="120px" height="120px" borderRadius="12px" />
        <div>
          <Skeleton width="300px" height="20px" />
        </div>
      </div>
    </div>
  );
}