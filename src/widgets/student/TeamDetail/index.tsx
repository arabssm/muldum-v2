"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState } from "react";
import Group from "@/components/group/teams";
import MonthlyTest from "../monthlyTest";
import Calendar from "../calendar";
import Notion from "../notion";
import VideoChat from "../videoChat";

type GroupType = "공유캘린더" | "월말평가" | "화상통화" | "노션";

export default function Items() {
    const [active, setActive] = useState<GroupType | null>(null);
    const [, setLockedMessage] = useState<string>("");

    return (
        <_.Container>
            <Group active={active} setActive={setActive} setMessage={setLockedMessage} />

            {active === "월말평가" ? (
                <MonthlyTest />
            ) : active === "공유캘린더" ? (
                <Calendar />
            ) : active === "노션" ? (
                <Notion />
            ) : active === "화상통화" ? (
                <VideoChat />
            ) : (
                <_.MessageWrapper>
                    <Image src="/assets/choice.svg" alt="No" width={120} height={120} />
                    <_.Message>원하는 기능을 선택하세요</_.Message>
                </_.MessageWrapper>
            )}
        </_.Container>
    );
}