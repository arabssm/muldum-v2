import { useState, useEffect } from "react";
import { getNotion, editNotion } from "@/shared/api/index";
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
                const data = await getNotion(teamId);
                setTitle(data.title || "동아리이름");
                setContent(data.content || "");
                setIcon(data.icon || "🌿");
                setCover(data.cover || null);
            } catch (error) {
                console.log("노션 데이터를 불러오지 못했지만 페이지 표시 가능");
                // 기본 값
            } finally {
                setLoading(false);
            }
        };
        fetchNotion();
    }, [teamId]);

    const saveNotion = async () => {
        try {
            await editNotion(teamId, { name: title, content });
            showToast.success("저장되었습니다.");
        } catch (error) {
            console.error("저장 실패:", error);
            showToast.error("저장 실패");
        }
    };

    return { title, setTitle, content, setContent, icon, setIcon, cover, setCover, loading, saveNotion };
};