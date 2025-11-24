'use client';

import * as _ from '../noticeWrite/style';
import { BtnPrimary, BtnSecondary } from '@/shared/ui/button';
import BlockNoteEditor from '@/shared/ui/tag';
import { useNoticeEdit } from '@/shared/hooks/useNoticeEdit';
import { useRouter } from 'next/navigation';
import Loading from '@/shared/ui/loading';

interface NoticeEditProps {
    id: string;
}

export default function NoticeEdit({ id }: NoticeEditProps) {
    const router = useRouter();
    const {
        files,
        fileInputRef,
        onDrop,
        onDragOver,
        onClickDrop,
        onInputChange,
        removeAt,
        title,
        setTitle,
        deadlineDate,
        setDeadlineDate,
        handleSubmit,
        setContent,
        isLoading,
        initialContent,
    } = useNoticeEdit(id);

    if (isLoading) {
        return <_.Container><Loading /></_.Container>;
    }

    return (
        <_.Container>
            <_.Group>
                <_.Title>공지사항 수정</_.Title>
                <_.Wrapper>
                    <_.SubTitle>제목</_.SubTitle>
                    <_.Input
                        type="text"
                        placeholder="공지사항 제목을 입력해주세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </_.Wrapper>
                <_.Wrapper>
                    <_.SubTitle>마감기한</_.SubTitle>
                    <_.DateInput
                        type="date"
                        value={deadlineDate}
                        onChange={(e) => setDeadlineDate(e.target.value)}
                    />
                </_.Wrapper>
                <_.Wrapper>
                    <_.SubTitle>내용</_.SubTitle>
                    <_.detail>
                        <BlockNoteEditor
                            initialContent={initialContent}
                            onChange={(val) => setContent(val)}
                        />
                    </_.detail>
                </_.Wrapper>
                <_.Wrapper>
                    <_.SubTitle>첨부파일</_.SubTitle>
                    <div style={{ flex: 1 }}>
                        <input ref={fileInputRef} type="file" multiple hidden onChange={onInputChange} />
                        <_.FileDrop onDrop={onDrop} onDragOver={onDragOver} onClick={onClickDrop}>
                            {files.length === 0 ? (
                                '클릭하여 파일을 넣거나 드래그 하세요.'
                            ) : (
                                <_.FileList>
                                    {files.map((p: any, idx: number) => {
                                        const fileUrl = p.url.toLowerCase();
                                        const rawFileName = p.file?.name || p.url.split('/').pop()?.split('?')[0] || '파일';
                                        // UUID 패턴 제거 (예: 477410da-2aa0-4168-8198-c0c71ba052d3_)
                                        const decodedFileName = decodeURIComponent(rawFileName);
                                        const cleanFileName = decodedFileName.replace(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_/i, '');
                                        const fileName = cleanFileName.length > 10 ? cleanFileName.slice(0, 10) + '...' : cleanFileName;
                                        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/.test(fileUrl);
                                        const isAudio = /\.(mp3|wav|ogg|m4a)(\?|$)/.test(fileUrl);
                                        const isVideo = /\.(mp4|webm|mov|avi)(\?|$)/.test(fileUrl);
                                        const isPdf = /\.pdf(\?|$)/.test(fileUrl);

                                        return (
                                            <_.FileItem key={p.url}>
                                                <_.ThumbnailWrapper>
                                                    {isImage ? (
                                                        <_.Thumbnail src={p.url} alt={fileName} />
                                                    ) : (
                                                        <div style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: '4px',
                                                            fontSize: '2rem'
                                                        }}>
                                                            {isAudio ? '🎵' : isVideo ? '🎬' : isPdf ? '📄' : '📎'}
                                                        </div>
                                                    )}
                                                    <_.RemoveBtn
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.stopPropagation();
                                                            removeAt(idx);
                                                        }}
                                                    >
                                                        ✕
                                                    </_.RemoveBtn>
                                                </_.ThumbnailWrapper>
                                                <_.FileName>{fileName}</_.FileName>
                                            </_.FileItem>
                                        );
                                    })}
                                </_.FileList>
                            )}
                        </_.FileDrop>
                    </div>
                </_.Wrapper>
                <_.BtnGroup>
                    <BtnSecondary onClick={() => router.back()}>취소</BtnSecondary>
                    <BtnPrimary onClick={handleSubmit}>수정하기</BtnPrimary>
                </_.BtnGroup>
            </_.Group>
        </_.Container>
    );
}
