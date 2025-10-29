"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function TeamSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} style={{ 
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            backgroundColor: index === 0 ? '#e3f2fd' : '#f5f5f5'
                        }}>
                            <Skeleton width="80px" height="20px" />
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} style={{ 
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            backgroundColor: index === 0 ? '#e3f2fd' : '#f5f5f5'
                        }}>
                            <Skeleton width="40px" height="20px" />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '1.5rem' 
            }}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} style={{ 
                        padding: '2rem',
                        borderRadius: '12px',
                        backgroundColor: '#fafafa',
                        border: '1px solid #e0e0e0'
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <Skeleton width="120px" height="24px" />
                        </div>
                        <div>
                            <Skeleton width="100%" height="16px" />
                            <div style={{ marginTop: '8px' }}>
                                <Skeleton width="80%" height="16px" />
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <Skeleton width="60%" height="16px" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}