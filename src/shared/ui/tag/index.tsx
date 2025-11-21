'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { BlockNoteEditorProps } from '@/shared/types';
import '@blocknote/mantine/style.css';

const BlockNoteEditor = dynamic(
  async () => {
    const { useCreateBlockNote } = await import('@blocknote/react');
    const { BlockNoteView } = await import('@blocknote/mantine');

    return function Editor({ initialContent, onChange, editable = true }: BlockNoteEditorProps) {
      const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
        uploadFile: async (file: File) => URL.createObjectURL(file),
      });

      useEffect(() => {
        if (!editor || !onChange) return;
        const unsubscribe = editor.onChange(() => {
          const content = JSON.stringify(editor.document, null, 2);
          onChange(content);
        });
        return () => unsubscribe();
      }, [editor, onChange]);

      return <BlockNoteView editor={editor} theme="light" editable={editable} />;
    };
  },
  { ssr: false }
);

export default BlockNoteEditor;