"use client";

import * as _ from './style';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { getNoticeDetail, deleteNotice } from '@/shared/api';
import type { NoticeDetail, NoticeDetailProps } from '@/shared/types/notice';
import Toast, { showToast } from "@/shared/ui/toast";
import BlockNoteEditor from '@/shared/ui/tag';
import { getUserInfo } from '@/shared/api/user';

export default function NoticeDetailPage({ id }: NoticeDetailProps) {
    const router = useRouter();
    const { id: noticeId } = useParams<{ id: string }>();

    const [notice, setNotice] = useState<NoticeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (!noticeId) return;

        const fetchData = async () => {
            try {
                const [noticeRes, userInfo] = await Promise.all([
                    getNoticeDetail(noticeId),
                    getUserInfo()
                ]);
                
                const data = noticeRes?.data ?? noticeRes;
                setNotice(data);
                setUserRole(userInfo.user_type);
                showToast.success("공지를 불러왔습니다!");
            } catch (err) {
                console.error('공지 상세 불러오기 실패:', err);
                showToast.error("공지를 불러오는데 실패했습니다!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [noticeId]);

    const handleDelete = async () => {
        if (!noticeId) return;
        
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteNotice(noticeId);
            showToast.success("공지가 삭제되었습니다!");
            setTimeout(() => {
                router.push('/notice');
            }, 500);
        } catch (err) {
            console.error('공지 삭제 실패:', err);
            showToast.error("공지 삭제에 실패했습니다!");
        }
    };

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            window.URL.revokeObjectURL(blobUrl);
            showToast.success("다운로드를 시작합니다!");
        } catch (err) {
            console.error('다운로드 실패:', err);
            showToast.error("다운로드에 실패했습니다!");
        }
    };

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
                <_.HeaderGroup>
                    <Image
                        src="/assets/arrow.svg"
                        alt="뒤로가기"
                        width={24}
                        height={24}
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.back()}
                    />
                    {userRole === "TEACHER" && (
                        <_.DeleteBtn onClick={handleDelete}>
                            삭제하기
                        </_.DeleteBtn>
                    )}
                </_.HeaderGroup>
                <_.Title>{notice.title}</_.Title>
                <_.Group>
                    <_.Subtitle>등록일: {formatDate(notice.updatedAt)}</_.Subtitle>
                    <_.Subtitle>마감일: {notice.deadlineDate || '-'}.</_.Subtitle>
                    <_.Subtitle>작성자: {notice.teacher || '-'}</_.Subtitle>
                </_.Group>
                <div>
                    {notice.content && notice.content.startsWith('[') ? (
                        <BlockNoteEditor 
                            initialContent={notice.content} 
                            onChange={() => {}}
                            editable={false}
                        />
                    ) : (
                        parseCustomTags(notice.content || '')
                    )}
                </div>
                {notice.files?.length ? (
                    <_.ImgGroup>
                        {notice.files
                            .filter(file => file?.url)
                            .map((file, idx) => (
                                <_.FileWrapper key={idx}>
                                    <Image
                                        src={file.url}
                                        alt={`공지 이미지 ${idx + 1}`}
                                        width={100}
                                        height={100}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                    <_.DownloadBtn
                                        onClick={() => {
                                            const filename = file.url.split('/').pop()?.split('?')[0] || `파일_${idx + 1}`;
                                            handleDownload(file.url, filename);
                                        }}
                                        title="다운로드"
                                    >
                                        <Image
                                            src="/assets/download.svg"
                                            alt="다운로드"
                                            width={20}
                                            height={20}
                                        />
                                    </_.DownloadBtn>
                                </_.FileWrapper>
                            ))}
                    </_.ImgGroup>
                ) : null}
            </_.Container>
        </>
    );
}