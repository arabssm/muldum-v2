import * as _ from "./style";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import BlockNoteEditor from '@/shared/ui/tag';
import { useCallback, useEffect, useRef, useState } from 'react';

type Preview = { file: File; url: string };

export default function noticeWrite() {
    const [files, setFiles] = useState<Preview[]>([]);
    const [content, setContent] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = useCallback((incoming: File[]) => {
        const previews = incoming.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
        setFiles((prev) => [...prev, ...previews]);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files || []);
        if (dropped.length === 0) return;
        handleFiles(dropped);
    }, [handleFiles]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const onClickDrop = () => {
        fileInputRef.current?.click();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const chosen = Array.from(e.target.files || []);
        if (chosen.length === 0) return;
        handleFiles(chosen);
        e.currentTarget.value = '';
    };

    const removeAt = (idx: number) => {
        setFiles((prev) => {
            const toRevoke = prev[idx];
            if (toRevoke) URL.revokeObjectURL(toRevoke.url);
            return prev.filter((_, i) => i !== idx);
        });
    };

    useEffect(() => {
        return () => {
            files.forEach((p) => URL.revokeObjectURL(p.url));
        };
    }, [files]);

    return (
        <_.Container>
            <_.Group>
                <_.Title>공지사항 작성</_.Title>
                <_.Wrapper>
                    <_.SubTitle>제목</_.SubTitle>
                    <_.Input type="text" placeholder="공지사항 제목을 입력해주세요." />
                </_.Wrapper>
                <_.Wrapper>
                    <_.SubTitle>마감기한</_.SubTitle>
                    <_.DateInput type="date" />
                </_.Wrapper>
                <_.Wrapper>
                    <_.SubTitle>내용</_.SubTitle>
                    <_.detail>
                        <BlockNoteEditor initialContent={content} onChange={setContent} />
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
                                                <_.RemoveBtn onClick={() => removeAt(idx)}>✕</_.RemoveBtn>
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
                    <BtnPrimary>작성하기</BtnPrimary>
                </_.BtnGroup>
            </_.Group>
        </_.Container>
    );
}