"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function SliderSkeleton() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '24vh' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Skeleton height="24vh" borderRadius="3.2px" />
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
          borderRadius: '3.2px'
        }} />
        
        <div style={{
          position: 'absolute',
          fontSize: '2.5rem',
          fontWeight: 500,
          top: '20%',
          left: '4%',
          width: '100%',
          color: '#fff'
        }}>
          <Skeleton width="200px" height="40px" />
        </div>
        
        <div style={{
          display: 'flex',
          fontSize: '1.5rem',
          fontWeight: 400,
          position: 'absolute',
          left: '4%',
          top: '52%',
          color: '#e9e9e9ff'
        }}>
          <Skeleton width="100px" height="24px" />
        </div>
        
        <div style={{
          fontSize: '1.5rem',
          position: 'absolute',
          fontWeight: 400,
          left: '4%',
          top: '67%',
          color: '#e9e9e9ff'
        }}>
          <Skeleton width="300px" height="24px" />
        </div>
        
        <div style={{
          position: 'absolute',
          fontSize: '5rem',
          fontWeight: 600,
          top: '30%',
          left: '82%',
          color: '#fff'
        }}>
          <Skeleton width="80px" height="80px" />
        </div>
        
        <div style={{
          position: 'absolute',
          left: '97%',
          top: '85%',
          color: '#D1D1D1'
        }}>
          <Skeleton width="40px" height="16px" />
        </div>
      </div>
    </div>
  );
}