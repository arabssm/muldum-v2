"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { BlockNoteEditorProps } from "@/shared/types";
import "@blocknote/mantine/style.css";

const BlockNoteEditor = dynamic(
    async () => {
        const { useCreateBlockNote } = await import("@blocknote/react");
        const { BlockNoteView } = await import("@blocknote/mantine");

        return function Editor({ initialContent, onChange }: BlockNoteEditorProps) {
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
                <>
                    <style jsx global>{`
            .bn-button[data-selected="true"] {
              background-color: #d9d9d9 !important;
            }

            .bn-button[data-selected="true"]:hover {
              background-color: #e4e4e4 !important;
            }

            .bn-button:not([data-selected="true"]) {
              background-color: transparent;
              color: inherit;
            }

            .bn-button {
              border-radius: 6px;
              transition: background-color 0.2s ease;
            }

            .bn-code {
              background-color: #f2f2f2 !important;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              font-size: 1rem;
              line-height: 1.6;
              overflow-x: auto;
            }

            .bn-code code {
              background: none !important;
              color: inherit;
            }

            .bn-code:focus-within {
              border-color: #c6c6c6;
              box-shadow: 0 0 0 1px #c6c6c6;
            }
          `}</style>

                    <BlockNoteView editor={editor} theme="light" />
                </>
            );
        };
    },
    { ssr: false }
);

export default BlockNoteEditor;