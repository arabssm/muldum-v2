"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { SkeletonAvatar, SkeletonTextBlock } from "@/shared/ui/skeleton/variants";

export default function ClubsSkeleton() {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '2rem', 
      justifyContent: 'flex-start' 
    }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index} 
          style={{ 
            display: 'flex',
            flex: '0 0 31.8%',
            padding: '3rem', 
            borderRadius: '1rem',
            flexDirection: 'column',
            gap: '0.8rem',
            backgroundColor: '#FAFAFA'
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <Skeleton width="160px" height="26px" />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SkeletonAvatar size="28px" />
              <Skeleton width="70px" height="18px" />
            </div>
          </div>
          <div>
            <SkeletonTextBlock lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}