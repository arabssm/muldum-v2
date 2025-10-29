"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function PaginationSkeleton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', margin: '2rem 0' }}>
      <Skeleton width="32px" height="32px" borderRadius="4px" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} width="32px" height="32px" borderRadius="4px" />
      ))}
      <Skeleton width="32px" height="32px" borderRadius="4px" />
    </div>
  );
}