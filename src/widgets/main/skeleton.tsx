"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { SkeletonCard, SkeletonListItem } from "@/shared/ui/skeleton/variants";

export default function MainSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 슬라이더 스켈레톤 */}
            <div style={{ marginBottom: '2rem' }}>
                <Skeleton height="320px" borderRadius="12px" />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '48%' }}>
                    {/* 메뉴 섹션 스켈레톤 */}
                    <div>
                        <Skeleton width="60px" height="28px" />
                    </div>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonCard key={index} style={{ marginBottom: '1rem', padding: '1.5rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <Skeleton width="140px" height="22px" />
                            </div>
                            <div>
                                <Skeleton width="220px" height="16px" />
                            </div>
                        </SkeletonCard>
                    ))}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '48%' }}>
                    {/* 공지사항 섹션 스켈레톤 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Skeleton width="100px" height="28px" />
                        </div>
                        <div>
                            <Skeleton width="70px" height="16px" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonListItem key={index}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '0.6rem 1.2rem', 
                                    borderRadius: '10rem', 
                                    backgroundColor: '#f8f9fa',
                                    minWidth: '60px' 
                                }}>
                                    <Skeleton width="45px" height="18px" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="350px" height="16px" />
                                </div>
                            </SkeletonListItem>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}