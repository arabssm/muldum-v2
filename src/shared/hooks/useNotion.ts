import { useState, useEffect } from "react";
import { getTeamPage, updateTeamPage, updateTeamBanner, updateTeamIcon } from "@/shared/api/index";
import { importNotionPageWithOAuth, startNotionOAuth } from "@/shared/api/notion";
import { showToast } from "@/shared/ui/toast";

// 마크다운을 BlockNote JSON 형식으로 변환
const convertMarkdownToBlockNote = (markdown: string): string => {
    const lines = markdown.split('\n');
    const blocks = [];
    let i = 0;
    
    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // 빈 줄 건너뛰기
        if (!trimmed) {
            i++;
            continue;
        }
        
        // 구분선 (---)
        if (trimmed === '---') {
            blocks.push({
                type: "paragraph",
                content: [{ type: "text", text: "───────────────────", styles: {} }]
            });
        }
        // Heading 3
        else if (trimmed.startsWith('### ')) {
            blocks.push({
                type: "heading",
                props: { level: 3 },
                content: [{ type: "text", text: trimmed.substring(4), styles: {} }]
            });
        }
        // Heading 2
        else if (trimmed.startsWith('## ')) {
            blocks.push({
                type: "heading",
                props: { level: 2 },
                content: [{ type: "text", text: trimmed.substring(3), styles: {} }]
            });
        }
        // Heading 1
        else if (trimmed.startsWith('# ')) {
            blocks.push({
                type: "heading",
                props: { level: 1 },
                content: [{ type: "text", text: trimmed.substring(2), styles: {} }]
            });
        }
        // 이미지 (![alt](url))
        else if (trimmed.match(/^!\[.*\]\(.*\)$/)) {
            const match = trimmed.match(/!\[(.*)\]\((.*)\)/);
            if (match) {
                const imageUrl = match[2];
                const altText = match[1];
                blocks.push({
                    type: "image",
                    props: {
                        url: imageUrl,
                        caption: altText || "",
                        previewWidth: 512
                    }
                });
            }
        }
        // Quote / Callout (> )
        else if (trimmed.startsWith('> ')) {
            const quoteText = trimmed.substring(2);
            blocks.push({
                type: "paragraph",
                content: [{ type: "text", text: quoteText, styles: { italic: true } }]
            });
        }
        // 들여쓰기된 Bullet list (  - 또는   - )
        else if (line.match(/^  +[-*] /)) {
            const indent = line.match(/^( +)/)?.[1].length || 0;
            const text = trimmed.substring(2);
            blocks.push({
                type: "bulletListItem",
                content: [{ type: "text", text: `${'  '.repeat(Math.floor(indent / 2))}${text}`, styles: {} }]
            });
        }
        // Bullet list (- 또는 *)
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            blocks.push({
                type: "bulletListItem",
                content: [{ type: "text", text: trimmed.substring(2), styles: {} }]
            });
        }
        // Numbered list
        else if (trimmed.match(/^\d+\. /)) {
            blocks.push({
                type: "numberedListItem",
                content: [{ type: "text", text: trimmed.replace(/^\d+\. /, ''), styles: {} }]
            });
        }
        // 볼드 텍스트 포함 (토글 제목 등)
        else if (trimmed.includes('**')) {
            const parts = trimmed.split('**');
            const content = [];
            for (let j = 0; j < parts.length; j++) {
                if (parts[j]) {
                    content.push({
                        type: "text",
                        text: parts[j],
                        styles: j % 2 === 1 ? { bold: true } : {}
                    });
                }
            }
            blocks.push({
                type: "paragraph",
                content: content.length > 0 ? content : [{ type: "text", text: trimmed, styles: {} }]
            });
        }
        // 일반 Paragraph
        else {
            blocks.push({
                type: "paragraph",
                content: [{ type: "text", text: trimmed, styles: {} }]
            });
        }
        
        i++;
    }
    
    return JSON.stringify(blocks, null, 2);
};

const DEFAULT_BANNER = "https://muldumarabucket.s3.ap-northeast-2.amazonaws.com/%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%80%E1%85%A9%E1%86%BC%E1%84%8C%E1%85%B5+%E1%84%87%E1%85%A2%E1%84%80%E1%85%A7%E1%86%BC.svg";
const DEFAULT_ICON = "https://muldumarabucket.s3.ap-northeast-2.amazonaws.com/defaulyicon.svg";

export const useNotion = (teamId: string) => {
    const [title, setTitle] = useState("동아리이름");
    const [content, setContent] = useState("");
    const [icon, setIcon] = useState(DEFAULT_ICON);
    const [cover, setCover] = useState<string | null>(DEFAULT_BANNER);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotion = async () => {
            try {
                const data = await getTeamPage(teamId);
                
                // 응답이 HTML인지 확인
                if (typeof data === 'string' && data.includes('<')) {
                    console.error("서버가 HTML을 반환했습니다. API 엔드포인트를 확인하세요.");
                    showToast.error("팀 페이지를 불러올 수 없습니다.");
                    return;
                }
                
                // 새 API 응답 구조: { teamId, teamName, content, config }
                setTitle(data.teamName || "동아리이름");
                setContent(data.content || "");
                // config에서 아이콘과 배너 정보 추출
                if (data.config) {
                    setIcon(data.config.iconImageUrl || DEFAULT_ICON);
                    setCover(data.config.backgroundImageUrl || DEFAULT_BANNER);
                }
            } catch (error: any) {
                console.error("팀 페이지 로드 에러:", error);
                
                // JSON 파싱 에러인 경우
                if (error.message?.includes('JSON') || error.message?.includes('Unexpected token')) {
                    console.error("서버가 잘못된 응답을 반환했습니다.");
                    showToast.error("서버 응답 오류가 발생했습니다.");
                } else {
                    console.log("팀 페이지 데이터를 불러오지 못했지만 페이지 표시 가능");
                }
                // 기본 값 유지
            } finally {
                setLoading(false);
            }
        };
        fetchNotion();
    }, [teamId]);

    const saveNotion = async () => {
        try {
            await updateTeamPage(Number(teamId), { name: title, content });
            showToast.success("저장되었습니다.");
        } catch (error) {
            console.error("저장 실패:", error);
            showToast.error("저장 실패");
        }
    };

    const updateBanner = async (url: string) => {
        await updateTeamBanner(Number(teamId), url);
        setCover(url);
    };

    const updateIcon = async (url: string) => {
        await updateTeamIcon(Number(teamId), url);
        setIcon(url);
    };

    const importFromNotion = async (notionUrl: string) => {
        try {
            setLoading(true);
            const data = await importNotionPageWithOAuth(notionUrl, Number(teamId));
            
            // 가져온 데이터로 상태 업데이트
            if (data.title) {
                setTitle(data.title);
            }
            
            if (data.content) {
                // 마크다운을 BlockNote JSON 형식으로 변환
                const blockNoteContent = convertMarkdownToBlockNote(data.content);
                setContent(blockNoteContent);
            }
            
            showToast.success("Notion 페이지를 가져왔습니다.");
        } catch (error: any) {
            console.error("Notion import 실패:", error);
            
            // 401 에러면 Notion 로그인 필요
            if (error.response?.status === 401) {
                showToast.error("Notion 로그인이 필요합니다.");
                // OAuth 플로우 시작
                startNotionOAuth(teamId);
            } else {
                showToast.error(error.message || "Notion 페이지를 가져오는데 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const connectNotion = () => {
        startNotionOAuth(teamId);
    };

    return { 
        title, 
        setTitle, 
        content, 
        setContent, 
        icon, 
        setIcon, 
        cover, 
        setCover, 
        loading, 
        saveNotion,
        updateBanner,
        updateIcon,
        importFromNotion,
        connectNotion
    };
};