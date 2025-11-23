import { useState, useEffect } from "react";
import { getTeamPage, updateTeamPage, updateTeamBanner, updateTeamIcon } from "@/shared/api/index";
import { showToast } from "@/shared/ui/toast";

export const useNotion = (teamId: string) => {
    const [title, setTitle] = useState("동아리이름");
    const [content, setContent] = useState("");
    const [icon, setIcon] = useState("🌿");
    const [cover, setCover] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotion = async () => {
            try {
                const data = await getTeamPage(teamId);
                // 새 API 응답 구조: { teamId, teamName, content, config }
                setTitle(data.teamName || "동아리이름");
                setContent(data.content || "");
                // config에서 아이콘과 배너 정보 추출
                if (data.config) {
                    setIcon(data.config.iconImageUrl || "🌿");
                    setCover(data.config.backgroundImageUrl || null);
                }
            } catch (error) {
                console.log("팀 페이지 데이터를 불러오지 못했지만 페이지 표시 가능");
                // 기본 값
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