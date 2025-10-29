"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function ReapplySkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Skeleton width="120px" height="32px" />
      </div>
      
      {/* 아이템 폼 스켈레톤 */}
      <div style={{ 
        marginBottom: '3rem', 
        padding: '2rem', 
        border: '1px solid #e0e0e0', 
        borderRadius: '12px',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Skeleton width="100px" height="20px" />
          <div style={{ marginTop: '8px' }}>
            <Skeleton width="100%" height="40px" borderRadius="8px" />
          </div>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <Skeleton width="80px" height="20px" />
          <div style={{ marginTop: '8px' }}>
            <Skeleton width="100%" height="100px" borderRadius="8px" />
          </div>
        </div>
        <Skeleton width="120px" height="48px" borderRadius="8px" />
      </div>
      
      <div>
        <Skeleton width="150px" height="32px" />
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '1rem' 
      }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ 
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>
                <Skeleton width="60px" height="14px" />
              </div>
              <div>
                <Skeleton width="120px" height="18px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}