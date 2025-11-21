'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

interface BlockNoteViewerProps {
    content: string;
}

export default function BlockNoteViewer({ content }: BlockNoteViewerProps) {
    const editor = useCreateBlockNote({
        initialContent: content ? JSON.parse(content) : undefined,
    });

    return <BlockNoteView editor={editor} theme="light" editable={false} />;
}
