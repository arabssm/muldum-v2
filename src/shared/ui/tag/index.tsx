'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { BlockNoteEditorProps } from '@/shared/types';
import '@blocknote/mantine/style.css';

const BlockNoteEditor = dynamic(
  async () => {
    const { useCreateBlockNote } = await import('@blocknote/react');
    const { BlockNoteView } = await import('@blocknote/mantine');
    const { defaultBlockSpecs } = await import('@blocknote/core');

    return function Editor({ initialContent, onChange, editable = true }: BlockNoteEditorProps) {
      const { image, audio, video, file, ...allowedBlocks } = defaultBlockSpecs;

      const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
        blockSpecs: allowedBlocks,
        placeholders: {
          default: "내용을 입력하세요...",
        },
      });

      useEffect(() => {
        if (!editor || !onChange) return;
        const unsubscribe = editor.onChange(() => {
          const content = JSON.stringify(editor.document, null, 2);
          onChange(content);
        });
        return () => unsubscribe();
      }, [editor, onChange]);

      return (
        <div style={{ width: '100%' }}>
          <BlockNoteView editor={editor} theme="light" editable={editable} />
        </div>
      );
    };
  },
  { ssr: false }
);

export default BlockNoteEditor;