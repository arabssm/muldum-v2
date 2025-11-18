"use client";

import * as _ from './style';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getNoticeDetail } from '@/shared/api/admin/notice';
import type { NoticeDetail } from '@/shared/types/notice';

export default function NoticeDetailPage() {
    const router = useRouter();

    const { id: noticeId } = useParams<{ id: string }>();

    const [notice, setNotice] = useState<NoticeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!noticeId) return;

        getNoticeDetail(noticeId)
            .then(res => setNotice(res?.data ?? res))
            .catch(err => console.error('공지 상세 불러오기 실패:', err))
            .finally(() => setIsLoading(false));
    }, [noticeId]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        const Y = d.getFullYear();
        const M = String(d.getMonth() + 1).padStart(2, '0');
        const D = String(d.getDate()).padStart(2, '0');
        let h = d.getHours();
        const m = String(d.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? '오후' : '오전';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${Y}-${M}-${D}. ${ampm} ${h}:${m}`;
    };

    if (isLoading) return <_.Container>로딩 중...</_.Container>;
    if (!notice) return <_.Container>공지가 존재하지 않습니다.</_.Container>;

    return (
        <_.Container>
            <Image
                src="/assets/arrow.svg"
                alt="뒤로가기"
                width={24}
                height={24}
                style={{ cursor: 'pointer' }}
                onClick={() => router.back()}
            />
            <_.Title>{notice.title}</_.Title>
            <_.Group>
                <_.Subtitle>등록일: {formatDate(notice.updatedAt)}</_.Subtitle>
                <_.Subtitle>마감일: {notice.deadlineDate || '-'}</_.Subtitle>
                <_.Subtitle>작성자: {notice.teacher || '-'}</_.Subtitle>
            </_.Group>
            {notice.files?.length ? (
                <_.ImgGroup>
                    {notice.files
                        .filter(file => file?.url)
                        .map((file, idx) => (
                            <Image
                                key={idx}
                                src={file.url}
                                alt={`공지 이미지 ${idx + 1}`}
                                width={1600}
                                height={414}
                                style={{ width: '100%', height: 'auto', marginBottom: 8 }}
                            />
                        ))}
                </_.ImgGroup>
            ) : null}
            <div dangerouslySetInnerHTML={{ __html: notice.content || '' }} />
        </_.Container>
    );
}