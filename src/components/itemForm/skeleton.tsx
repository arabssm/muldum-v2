"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function ItemFormSkeleton() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      padding: '2rem',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      backgroundColor: '#fafafa'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <Skeleton width="80px" height="20px" />
        </div>
        <div>
          <Skeleton width="100%" height="48px" borderRadius="8px" />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <Skeleton width="100px" height="20px" />
        </div>
        <div>
          <Skeleton width="100%" height="120px" borderRadius="8px" />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <Skeleton width="60px" height="20px" />
        </div>
        <div>
          <Skeleton width="100%" height="48px" borderRadius="8px" />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Skeleton width="100px" height="48px" borderRadius="8px" />
        <Skeleton width="80px" height="48px" borderRadius="8px" />
      </div>
    </div>
  );
}