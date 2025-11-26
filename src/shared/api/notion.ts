import axios from "axios";
import axiosInstance from "../lib/axiosInstance";

// Notion 페이지 ID 추출 (URL에서)
export const extractNotionPageId = (url: string): string | null => {
    // https://www.notion.so/Page-Title-abc123def456 형식
    const match = url.match(/([a-f0-9]{32})|([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);
    return match ? match[0].replace(/-/g, '') : null;
};

// 방법 1: 사용자 OAuth 토큰으로 가져오기 (권장)
export const importNotionPageWithUserAuth = async (notionUrl: string, teamId: number, userAccessToken: string) => {
    const pageId = extractNotionPageId(notionUrl);
    if (!pageId) {
        throw new Error("유효하지 않은 Notion URL입니다");
    }

    const response = await axiosInstance.post(`/api/teams/${teamId}/import-notion`, {
        pageId,
        userAccessToken // 사용자의 Notion OAuth 토큰
    });
    
    return response.data;
};

// 방법 2: 서버 Integration으로 가져오기 (권한 있는 페이지만)
export const importNotionPage = async (notionUrl: string, teamId: number) => {
    const pageId = extractNotionPageId(notionUrl);
    if (!pageId) {
        throw new Error("유효하지 않은 Notion URL입니다");
    }

    const response = await axiosInstance.post(`/api/teams/${teamId}/import-notion`, {
        pageId
    });
    
    return response.data;
};

// Notion OAuth 인증 시작
export const startNotionOAuth = (teamId: string) => {
    const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_NOTION_REDIRECT_URI || '');
    
    // state에 teamId 포함하여 콜백에서 사용
    const state = encodeURIComponent(JSON.stringify({ teamId }));
    
    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${redirectUri}&state=${state}`;
    
    window.location.href = authUrl;
};

// Notion OAuth 콜백 처리 (백엔드에서)
export const handleNotionCallback = async (code: string) => {
    const response = await axiosInstance.post('/api/notion/oauth/callback', { code });
    return response.data; // { access_token, workspace_id, ... }
};

// 사용자 Notion 토큰으로 페이지 가져오기
export const importNotionPageWithOAuth = async (notionUrl: string, teamId: number) => {
    const pageId = extractNotionPageId(notionUrl);
    
    if (!pageId) {
        throw new Error("유효하지 않은 Notion URL입니다");
    }

    const response = await axiosInstance.post(`/api/teams/${teamId}/import-notion-oauth`, { pageId });
    
    return response.data;
};
