"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function MonthlyTestSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', width: '100%', margin: '0 auto' }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Skeleton width="200px" height="24px" />
          {index === 3 ? (
            <Skeleton width="100%" height="20vh" borderRadius="4px" />
          ) : (
            <Skeleton width="100%" height="45px" borderRadius="4px" />
          )}
        </div>
      ))}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Skeleton width="280px" height="44px" borderRadius="4px" />
        <Skeleton width="100px" height="44px" borderRadius="4px" />
      </div>
    </div>
  );
}