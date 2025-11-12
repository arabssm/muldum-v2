"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function NoticeSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <Skeleton width="100px" height="24px" />
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        backgroundColor: '#FAFAFA', 
                        borderRadius: '4px', 
                        padding: '0.75rem',
                        gap: '0.5rem'
                    }}>
                        <Skeleton width="18px" height="18px" borderRadius="4px" />
                        <Skeleton width="200px" height="14px" borderRadius="4px" />
                    </div>
                </div>
                <Skeleton width="80px" height="36px" borderRadius="4px" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '0.6rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <Skeleton width="60px" height="32px" borderRadius="10rem" />
                            <Skeleton width="400px" height="20px" borderRadius="4px" />
                        </div>
                        <Skeleton width="80px" height="16px" borderRadius="4px" />
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} width="32px" height="32px" borderRadius="4px" />
                ))}
            </div>
        </div>
    );
}