"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function ClubsSkeleton() {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '2rem', 
      justifyContent: 'space-between',
      whiteSpace: 'normal',
      rowGap: '2rem'
    }}>
      {Array.from({ length: 12 }).map((_, index) => (
        <div 
          key={index} 
          style={{ 
            display: 'flex',
            flex: '0 0 31%',
            padding: '3rem', 
            borderRadius: '1rem',
            justifyContent: 'center',
            flexDirection: 'column',
            rowGap: '0.8rem',
            backgroundColor: '#FAFAFA'
          }}
        >
          <div style={{ fontSize: '1.75rem', fontWeight: 600 }}>
            <Skeleton width="120px" height="28px" />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '1.075rem', 
              color: '#FF9B62', 
              gap: '0.4rem' 
            }}>
              <Skeleton width="24px" height="24px" borderRadius="50%" />
              <Skeleton width="60px" height="17px" />
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            fontSize: '1.075rem', 
            color: '#B2B2B2' 
          }}>
            <Skeleton width="100%" height="17px" />
          </div>
        </div>
      ))}
    </div>
  );
}