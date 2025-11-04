import { useCallback, useEffect, useRef, useState } from 'react';

export type Preview = { file: File; url: string };

export default function useFilePreviews() {
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

    return {
        files,
        fileInputRef,
        handleFiles,
        onDrop,
        onDragOver,
        onClickDrop,
        onInputChange,
        removeAt,
        setFiles,
    } as const;
}