"use client";

import * as _ from './style';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { getNoticeDetail } from '@/shared/api/admin/notice';
import type { NoticeDetail, NoticeDetailProps } from '@/shared/types/notice';
import Toast, { handleSuccess, handleError } from "@/shared/ui/toast";

export default function NoticeDetailPage({ id }: NoticeDetailProps) {
    const router = useRouter();
    const { id: noticeId } = useParams<{ id: string }>();

    const [notice, setNotice] = useState<NoticeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!noticeId) return;

        getNoticeDetail(noticeId)
            .then(res => {
                const data = res?.data ?? res;
                setNotice(data);
                handleSuccess();
            })
            .catch(err => {
                console.error('공지 상세 불러오기 실패:', err);
                handleError();
            })
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

    const parseCustomTags = (text: string): ReactNode => {
        if (!text) return null;
        const parts = text.split(/<\/?제목[1-4]>/).filter(Boolean);
        const matches = text.match(/<제목[1-4]>|<\/제목[1-4]>/g) || [];
        const result: ReactNode[] = [];
        let tagIndex = 0;

        for (let i = 0; i < parts.length; i++) {
            const content = parts[i].trim();
            let tag = matches[tagIndex] || '<제목1>';

            if (tag.startsWith('<제목1')) result.push(<h1 key={i} style={{ margin: '8px 0' }}>{content}</h1>);
            else if (tag.startsWith('<제목2')) result.push(<h2 key={i} style={{ margin: '8px 0' }}>{content}</h2>);
            else if (tag.startsWith('<제목3')) result.push(<h3 key={i} style={{ margin: '8px 0' }}>{content}</h3>);
            else if (tag.startsWith('<제목4')) result.push(<h4 key={i} style={{ margin: '8px 0' }}>{content}</h4>);
            else result.push(<p key={i} style={{ margin: '8px 0' }}>{content}</p>);

            tagIndex++;
        }

        return <>{result}</>;
    };

    if (isLoading) return <_.Container>로딩 중...</_.Container>;
    if (!notice) return <_.Container>공지가 존재하지 않습니다.</_.Container>;

    return (
        <>
            <Toast />
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
                <div>{parseCustomTags(notice.content || '')}</div>
            </_.Container>
        </>
    );
}