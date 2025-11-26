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
      const { audio, video, file, ...allowedBlocks } = defaultBlockSpecs;

      const parseContent = (content: string) => {
        if (!content) return undefined;
        try {
          // JSON 형식인지 확인 (배열이나 객체로 시작하는지)
          const trimmed = content.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            return JSON.parse(content);
          }
          // HTML이나 일반 텍스트인 경우 undefined 반환 (기본 블록 사용)
          return undefined;
        } catch (error) {
          console.warn('Failed to parse content:', error);
          return undefined;
        }
      };

      const editor = useCreateBlockNote({
        initialContent: parseContent(initialContent),
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