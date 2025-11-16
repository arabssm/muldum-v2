// hooks/useNoticeWrite.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createNoticeGeneral } from '@/shared/api/admin/notice';

export type Preview = { file: File; url: string };

export function useNoticeWrite() {
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

    const handleSubmit = async () => {
        try {
            const payloadFiles = files.map(f => ({ name: f.file.name, url: f.url }));
            const content = getContent();

            await createNoticeGeneral(title, content, payloadFiles, deadlineDate);
        } catch (err) {
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
    } as const;
}