"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Group from "@/components/group/teams";
import MonthlyTest from "../monthlyTest";
import Calendar from "../calendar";
import Notion from "../notion";
import VideoChat from "../videoChat";
import { getUserInfo } from "@/shared/api/user";

type GroupType = "공유캘린더" | "월말평가" | "화상통화" | "노션";

export default function Items() {
    const params = useParams();
    const teamId = params?.id as string;
    
    const [active, setActive] = useState<GroupType | null>(null);
    const [, setLockedMessage] = useState<string>("");
    const [isOwnTeam, setIsOwnTeam] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkTeamOwnership = async () => {
            try {
                const userInfo = await getUserInfo();
                console.log("User Info:", userInfo);
                console.log("User teamId:", userInfo.teamId, "Page teamId:", teamId);
                
                const isOwn = userInfo.teamId?.toString() === teamId;
                console.log("Is own team:", isOwn);
                
                setIsOwnTeam(isOwn);
                // 첫 번째 항목 자동 선택
                setActive(isOwn ? "공유캘린더" : "노션");
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                setIsOwnTeam(false);
                setActive("노션");
            } finally {
                setIsLoading(false);
            }
        };

        checkTeamOwnership();
    }, [teamId]);

    if (isLoading) {
        return (
            <_.Container>
                <_.MessageWrapper>
                    <_.Message>로딩 중...</_.Message>
                </_.MessageWrapper>
            </_.Container>
        );
    }

    return (
        <_.Container>
            <Group 
                active={active} 
                setActive={setActive} 
                setMessage={setLockedMessage}
                isOwnTeam={isOwnTeam}
            />

            {active === "월말평가" ? (
                isOwnTeam ? <MonthlyTest sections={[]} /> : null
            ) : active === "공유캘린더" ? (
                isOwnTeam ? <Calendar /> : null
            ) : active === "노션" ? (
                <Notion readOnly={!isOwnTeam} />
            ) : active === "화상통화" ? (
                isOwnTeam ? <VideoChat /> : null
            ) : (
                <_.MessageWrapper>
                    <Image src="/assets/choice.svg" alt="No" width={120} height={120} />
                    <_.Message>원하는 기능을 선택하세요</_.Message>
                </_.MessageWrapper>
            )}
        </_.Container>
    );
}