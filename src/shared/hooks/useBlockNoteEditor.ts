"use client";

import { useEffect, useState } from 'react';
import { useCreateBlockNote } from '@blocknote/react';

export default function useBlockNoteEditor(initialContent?: string) {
    const isBrowser = typeof window !== 'undefined';
    const editor = isBrowser ? useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
        uploadFile: async (file: File) => {
            const url = URL.createObjectURL(file);
            return url;
        },
    }) : null;

    const [content, setContent] = useState<string>(initialContent || '');

    useEffect(() => {
        if (!editor) return;
        const unsubscribe = editor.onChange(() => {
            const c = JSON.stringify(editor.document, null, 2);
            setContent(c);
        });
        return () => unsubscribe();
    }, [editor]);

    const insertImage = (url: string) => {
        if (!editor) return false;
        try {
            const anyEditor: any = editor as any;
            if (typeof anyEditor.insertImage === 'function') {
                anyEditor.insertImage(url);
                return true;
            }
            // try possible method names
            if (typeof anyEditor.insertBlocks === 'function') {
                anyEditor.insertBlocks([{ type: 'image', data: { src: url } }]);
                return true;
            }
            if (typeof anyEditor.insertBlock === 'function') {
                anyEditor.insertBlock({ type: 'image', data: { src: url } });
                return true;
            }
        } catch (e) {
            console.warn('insert image failed', e);
        }
        return false;
    };

    return {
        editor,
        content,
        insertImage,
    } as const;
}