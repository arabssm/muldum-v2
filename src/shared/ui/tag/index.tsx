"use client";

import { useEffect } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface BlockNoteEditorProps {
    initialContent: string;
    onChange: (content: string) => void;
}

export default function BlockNoteEditor({
    initialContent,
    onChange,
}: BlockNoteEditorProps) {
    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,

        uploadFile: async (file: File) => {
            const url = URL.createObjectURL(file);
            return url;
        },
    });

    useEffect(() => {
        if (!editor) return;

        const unsubscribe = editor.onChange(() => {
            const content = JSON.stringify(editor.document, null, 2);
            onChange(content);
        });

        return () => unsubscribe();
    }, [editor, onChange]);

    return (
        <div>
            <BlockNoteView editor={editor} theme="light" />
        </div>
    );
}