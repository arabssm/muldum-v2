import { useState, useEffect } from "react";
import { getTeamPage, updateTeamPage, updateTeamBanner, updateTeamIcon } from "@/shared/api/index";
import { showToast } from "@/shared/ui/toast";

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
        try {
            await updateTeamBanner(Number(teamId), url);
            setCover(url);
            showToast.success("배너가 수정되었습니다.");
        } catch (error) {
            console.error("배너 수정 실패:", error);
            showToast.error("배너 수정 실패");
        }
    };

    const updateIcon = async (url: string) => {
        try {
            await updateTeamIcon(Number(teamId), url);
            setIcon(url);
            showToast.success("아이콘이 수정되었습니다.");
        } catch (error) {
            console.error("아이콘 수정 실패:", error);
            showToast.error("아이콘 수정 실패");
        }
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
        updateIcon
    };
};