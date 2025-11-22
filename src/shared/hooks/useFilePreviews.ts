'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNoticeGeneral, getPresignedUrl, uploadFileToS3 } from '@/shared/api/admin/notice';
import { showToast } from '@/shared/ui/toast';

export type Preview = { file: File; url: string };

export function useNoticeWrite() {
    const router = useRouter();
    const [files, setFiles] = useState<Preview[]>([]);
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

    const onDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);

    const onClickDrop = () => fileInputRef.current?.click();

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const chosen = Array.from(e.target.files || []);
        if (chosen.length === 0) return;
        handleFiles(chosen);
        e.currentTarget.value = '';
    };

    const removeAt = useCallback((idx: number) => {
        setFiles((prev) => {
            const toRevoke = prev[idx];
            if (toRevoke) URL.revokeObjectURL(toRevoke.url);
            return prev.filter((_, i) => i !== idx);
        });
    }, []);

    useEffect(() => {
        return () => {
            files.forEach((p) => URL.revokeObjectURL(p.url));
        };
    }, [files]);

    const editorRef = useRef<any>(null);
    const getContent = () => editorRef.current?.getContent?.() || '';

    const [title, setTitle] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        try {
            // 파일 업로드
            const uploadedFiles = await Promise.all(
                files.map(async (f) => {
                    try {
                        const presignedData = await getPresignedUrl(f.file.name);
                        const s3Url = await uploadFileToS3(presignedData, f.file);
                        return { name: f.file.name, url: s3Url };
                    } catch (error) {
                        console.error('파일 업로드 실패:', f.file.name, error);
                        throw error;
                    }
                })
            );

            // 빈 블록 제거
            let filteredContent = content;
            try {
                const blocks = JSON.parse(content);
                const nonEmptyBlocks = blocks.filter((block: any) => {
                    // content가 있거나 children이 있는 블록만 유지
                    return (block.content && block.content.length > 0) || 
                           (block.children && block.children.length > 0);
                });
                filteredContent = JSON.stringify(nonEmptyBlocks);
            } catch (e) {
                // JSON 파싱 실패시 원본 사용
                filteredContent = content;
            }

            await createNoticeGeneral(title, filteredContent, uploadedFiles, deadlineDate);
            showToast.success('공지가 등록되었습니다!');
            setTimeout(() => {
                router.push('/notice');
            }, 500);
        } catch (err) {
            console.error('공지 작성 실패:', err);
            showToast.error('공지 등록에 실패했습니다!');
        }
    };

    return {
        files,
        fileInputRef,
        onDrop,
        onDragOver,
        onClickDrop,
        onInputChange,
        removeAt,
        setFiles,
        editorRef,
        getContent,
        title,
        setTitle,
        deadlineDate,
        setDeadlineDate,
        handleSubmit,
        content,
        setContent,
    } as const;
}