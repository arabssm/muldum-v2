'use client';

import * as _ from './style';
import { BtnPrimary, BtnSecondary } from '@/shared/ui/button';
import BlockNoteEditor from '@/shared/ui/tag';
import { useNoticeWrite } from '@/shared/hooks/useFilePreviews';
import { useState } from 'react';

export default function NoticeWrite() {
    const [content, setContent] = useState('');

    const {
        files,
        fileInputRef,
        onDrop,
        onDragOver,
        onClickDrop,
        onInputChange,
        removeAt,
        editorRef,
        title,
        setTitle,
        deadlineDate,
        setDeadlineDate,
        handleSubmit,
    } = useNoticeWrite();

    return (
        <_.Container>
            <_.Group>
                <_.Title>공지사항 작성</_.Title>
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
                            initialContent={''}
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
                                    {files.map((p, idx) => (
                                        <_.FileItem key={p.url}>
                                            <_.ThumbnailWrapper>
                                                <_.Thumbnail src={p.url} alt={p.file.name} />
                                                <_.RemoveBtn
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAt(idx);
                                                    }}
                                                >
                                                    ✕
                                                </_.RemoveBtn>
                                            </_.ThumbnailWrapper>
                                            <_.FileName>{p.file.name}</_.FileName>
                                        </_.FileItem>
                                    ))}
                                </_.FileList>
                            )}
                        </_.FileDrop>
                    </div>
                </_.Wrapper>
                <_.BtnGroup>
                    <BtnSecondary>취소</BtnSecondary>
                    <BtnPrimary onClick={handleSubmit}>작성하기</BtnPrimary>
                </_.BtnGroup>
            </_.Group>
        </_.Container>
    );
}