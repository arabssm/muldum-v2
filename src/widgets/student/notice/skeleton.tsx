"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function NoticeSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Skeleton width="100px" height="32px" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Skeleton width="24px" height="24px" borderRadius="50%" />
                    <Skeleton width="200px" height="40px" borderRadius="8px" />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '1rem',
                        borderBottom: '1px solid #f1f3f4'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '0.6rem 1.2rem', 
                                borderRadius: '10rem', 
                                backgroundColor: '#E0E0E0' 
                            }}>
                                <Skeleton width="40px" height="16px" />
                            </div>
                            <div>
                                <Skeleton width="400px" height="16px" />
                            </div>
                        </div>
                        <div>
                            <Skeleton width="80px" height="14px" />
                        </div>
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