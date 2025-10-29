"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function MonthlyTestSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} style={{ 
          marginBottom: '2rem', 
          padding: '1.5rem', 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <Skeleton width="200px" height="24px" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Skeleton width="100%" height="16px" />
            <div style={{ marginTop: '8px' }}>
              <Skeleton width="80%" height="16px" />
            </div>
          </div>
          <Skeleton width="100%" height="120px" borderRadius="8px" />
        </div>
      ))}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Skeleton width="200px" height="48px" borderRadius="8px" />
        <Skeleton width="100px" height="48px" borderRadius="8px" />
      </div>
    </div>
  );
}