"use client";

import { useState } from "react";
import * as _ from "./style";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";

export default function MonthCheck() {
    const router = useRouter();
    const [club, setClub] = useState("");
    const clubOptions = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    const [checked, setChecked] = useState<boolean[]>(
        new Array(clubOptions.length).fill(false)
    );

    const getCheckboxIcon = (isChecked: boolean) =>
        isChecked ? "/assets/checkbox.svg" : "/assets/nonCheck.svg";

    const handleCheckboxClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setChecked((prev) =>
            prev.map((v, i) => (i === index ? !v : v))
        );
    };

    return (
        <_.Container>
            <_.Group>
                <_.Title>월말평가</_.Title>
                <_.SubTitle>클릭하면 월말평가 채점 페이지로 이동합니다</_.SubTitle>
            </_.Group>
            <_.BtnWrapper>
                <_.Btn>전체</_.Btn>
                <_.Btn>이전 월말평가 조회</_.Btn>
                <_.Btn>아라</_.Btn>
            </_.BtnWrapper>
            <_.SelectWrapper>
                <_.Select
                    id="club"
                    value={club}
                    onChange={(e) => setClub(e.target.value)}
                >
                    <option value="">전체</option>
                    {clubOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </_.Select>
                <Image
                    src="/assets/toggle.svg"
                    alt="토글"
                    width={20}
                    height={20}
                    style={{
                        position: "absolute",
                        left: "2.65rem",
                        top: "1.15rem",
                        transform: "translateY(-50%) rotate(90deg)",
                        pointerEvents: "none",
                    }}
                />
            </_.SelectWrapper>
            <_.Wrapper>
                {clubOptions.map((month, index) => (
                    <div
                        key={month}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                            cursor: "pointer",
                        }}
                        onClick={(e) => handleCheckboxClick(index, e)}
                    >
                        <Image
                            src={getCheckboxIcon(checked[index])}
                            alt="체크박스"
                            width={20}
                            height={20}
                            style={{ marginRight: "0.5rem" }}
                        />
                        <span
                            onClick={() => router.push('/monthWatch')}
                            style={{ cursor: "pointer" }}
                        >{month} 월말평가</span>
                    </div>
                ))}
            </_.Wrapper>
            <_.BtnGroup>
                <BtnSecondary>거절</BtnSecondary>
                <BtnPrimary>승인</BtnPrimary>
            </_.BtnGroup>
        </_.Container>
    );
}