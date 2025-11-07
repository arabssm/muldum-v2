"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function TeamSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', width: '100%', margin: '0 auto' }}>
      {/* Group 탭들 - 정적이므로 스켈레톤 불필요 */}

      {/* BoxGroup - 동아리 카드들 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', width: '100%' }}>
        {Array.from({ length: 8 }).map((__, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              padding: '2rem 1.8rem',
              backgroundColor: '#FAFAFA',
              borderRadius: '4px',
              minHeight: '140px'
            }}
          >
            {/* 동아리 이름 */}
            <Skeleton width="140px" height="28px" />

            {/* 멤버 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Skeleton width="100%" height="18px" />
              <Skeleton width="85%" height="18px" />
              <Skeleton width="60%" height="18px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
