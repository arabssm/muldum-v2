"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function MainSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', rowGap: '2rem' }}>
            <div>
                <Skeleton height="24vh" borderRadius="3.2px" />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1.5rem', width: '48%' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                        <Skeleton width="60px" height="24px" />
                    </div>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            textAlign: 'left',
                            width: '100%',
                            padding: '1.5rem',
                            rowGap: '0.4rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#FAFAFA'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                                <Skeleton width="180px" height="24px" />
                            </div>
                            <div style={{ fontSize: '1rem', color: '#B2B2B2', fontWeight: 500 }}>
                                <Skeleton width="80px" height="16px" />
                            </div>
                        </div>
                    ))}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1.5rem', width: '48%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                            <Skeleton width="100px" height="24px" />
                        </div>
                        <div style={{ fontSize: '1rem', color: '#B2B2B2', fontWeight: 500 }}>
                            <Skeleton width="70px" height="16px" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '0.2rem' }}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                padding: '0.6rem',
                                cursor: 'pointer'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '10rem',
                                    color: '#fff',
                                    backgroundColor: index === 0 ? '#FF9B62' : '#D1D1D1'
                                }}>
                                    <Skeleton width="30px" height="16px" />
                                </div>
                                <div style={{ fontSize: '1.25rem' }}>
                                    <Skeleton width="200px" height="20px" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}