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
import Loading from '@/shared/ui/loading';

export default function NoticeDetailPage({ id }: NoticeDetailProps) {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const noticeId = params?.id || id;

    console.log('NoticeDetailPage - props id:', id);
    console.log('NoticeDetailPage - params:', params);
    console.log('NoticeDetailPage - noticeId:', noticeId);

    const [notice, setNotice] = useState<NoticeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (!noticeId) return;

        const fetchData = async () => {
            try {
                const noticeRes = await getNoticeDetail(noticeId);
                const data = noticeRes?.data ?? noticeRes;
                setNotice(data);
                
                // 사용자 정보는 선택적으로 가져오기 (로그인하지 않아도 공지 조회 가능)
                try {
                    const userInfo = await getUserInfo();
                    setUserRole(userInfo.user_type);
                } catch (userErr) {
                    console.log('사용자 정보 없음 (비로그인 상태)');
                    setUserRole(null);
                }
                
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

    if (isLoading) return <_.Container><Loading /></_.Container>;
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <_.DeleteBtn onClick={() => {
                                console.log('수정하기 버튼 클릭 - noticeId:', noticeId);
                                router.push(`/noticeEdit/${noticeId}`);
                            }}>
                                수정하기
                            </_.DeleteBtn>
                            <_.DeleteBtn onClick={handleDelete}>
                                삭제하기
                            </_.DeleteBtn>
                        </div>
                    )}
                </_.HeaderGroup>
                <_.Title>{notice.title}</_.Title>
                <_.Group>
                    <_.Subtitle>등록일: {formatDate(notice.updatedAt)}</_.Subtitle>
                    <_.Subtitle>마감일: {notice.deadlineDate || '-'}.</_.Subtitle>
                    <_.Subtitle>작성자: {notice.teacher || '-'}</_.Subtitle>
                </_.Group>
                <div>
                    {(() => {
                        try {
                            if (notice.content && notice.content.startsWith('[')) {
                                const parsed = JSON.parse(notice.content);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    return (
                                        <BlockNoteEditor 
                                            initialContent={notice.content} 
                                            onChange={() => {}}
                                            editable={false}
                                        />
                                    );
                                }
                            }
                        } catch (e) {
                            console.error('BlockNote 파싱 실패:', e);
                        }
                        return parseCustomTags(notice.content || '');
                    })()}
                </div>
                {notice.files?.length ? (
                    <_.ImgGroup>
                        {notice.files
                            .filter(file => file?.url)
                            .map((file, idx) => {
                                const fileUrl = file.url.toLowerCase();
                                const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/.test(fileUrl);
                                const isAudio = /\.(mp3|wav|ogg|m4a)(\?|$)/.test(fileUrl);
                                const isVideo = /\.(mp4|webm|mov|avi)(\?|$)/.test(fileUrl);
                                const isPdf = /\.pdf(\?|$)/.test(fileUrl);

                                return (
                                    <_.FileWrapper key={idx} style={{ width: isImage ? '30%' : '100%' }}>
                                        {isImage ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '70%' }}>
                                                {isAudio ? (
                                                    <audio controls style={{ width: '100%' }}>
                                                        <source src={file.url} />
                                                        브라우저가 오디오를 지원하지 않습니다.
                                                    </audio>
                                                ) : isVideo ? (
                                                    <video controls style={{ width: '100%', height: 'auto', maxHeight: '50vh' }}>
                                                        <source src={file.url} />
                                                        브라우저가 비디오를 지원하지 않습니다.
                                                    </video>
                                                ) : isPdf ? (
                                                    <iframe
                                                        src={file.url}
                                                        style={{ width: '100%', height: '50vh', border: '1px solid #ddd', borderRadius: '4px' }}
                                                        title={`PDF ${idx + 1}`}
                                                    />
                                                ) : (
                                                    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                                        <p>파일: {file.url.split('/').pop()?.split('?')[0] || `파일_${idx + 1}`}</p>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        const filename = file.url.split('/').pop()?.split('?')[0] || `파일_${idx + 1}`;
                                                        handleDownload(file.url, filename);
                                                    }}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#4B4B4B',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        alignSelf: 'flex-start'
                                                    }}
                                                >
                                                    다운로드
                                                </button>
                                            </div>
                                        )}
                                    </_.FileWrapper>
                                );
                            })}
                    </_.ImgGroup>
                ) : null}
            </_.Container>
        </>
    );
}