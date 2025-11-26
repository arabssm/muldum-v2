'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

interface BlockNoteViewerProps {
    content: string;
}

export default function BlockNoteViewer({ content }: BlockNoteViewerProps) {
    const parseContent = (content: string) => {
        if (!content) return undefined;
        try {
            const trimmed = content.trim();
            if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                return JSON.parse(content);
            }
            return undefined;
        } catch (error) {
            console.warn('Failed to parse content:', error);
            return undefined;
        }
    };

    const editor = useCreateBlockNote({
        initialContent: parseContent(content),
    });

    return <BlockNoteView editor={editor} theme="light" editable={false} />;
}
