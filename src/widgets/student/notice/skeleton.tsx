"use client";

import { Skeleton } from "@/shared/ui/skeleton";

export default function NoticeSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* NoticeContainer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {Array.from({ length: 10 }).map((__, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.8rem',
                        padding: '0.6rem'
                    }}>
                        {/* NoticeWrapper: Badge + Notice */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                            <Skeleton width="60px" height="36px" borderRadius="10rem" />
                            <Skeleton width="450px" height="25px" />
                        </div>
                        {/* Date */}
                        <Skeleton width="100px" height="20px" />
                    </div>
                ))}
            </div>
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {Array.from({ length: 5 }).map((__, index) => (
                    <Skeleton key={index} width="32px" height="32px" borderRadius="4px" />
                ))}
            </div>
        </div>
    );
}