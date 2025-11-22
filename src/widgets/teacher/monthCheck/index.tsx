"use client";

import { useState, useEffect } from "react";
import * as _ from "./style";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import { useAdminMonthReports } from "@/shared/hooks/useAdminMonthReports";
import Loading from "@/shared/ui/loading";

export default function MonthCheck() {
    const router = useRouter();
    const clubOptions = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const [club, setClub] = useState("");
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [checked, setChecked] = useState<boolean[]>(new Array(clubOptions.length).fill(false));

    const { reports, loading, error, fetchReport } = useAdminMonthReports(clubOptions);

    const getCheckboxIcon = (isChecked: boolean) =>
        isChecked ? "/assets/checkbox.svg" : "/assets/nonCheck.svg";

    const handleCheckboxClick = async (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));

        if (!reports[index].sections.length) {
            await fetchReport(index);
        }
        setOpenIndex(openIndex === index ? null : index);
    };

    if (error) return <div>{error}</div>;

    return (
        <_.Container>
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
                {clubOptions
                    .filter((month) => !club || club === month)
                    .map((month, index) => (
                        <div
                            key={month}
                            style={{ display: "flex", flexDirection: "column", marginBottom: "0.5rem", cursor: "pointer" }}
                        >
                            <div
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                                onClick={(e) => handleCheckboxClick(index, e)}
                            >
                                <Image src={getCheckboxIcon(checked[index])} alt="체크박스" width={20} height={20} />
                                <span>{month} 월말평가</span>
                                <_.Gray onClick={() => router.push("/monthWatch")} style={{ cursor: "pointer" }}>
                                    클릭하여 보기
                                </_.Gray>
                            </div>

                            {openIndex === index && (
                                <div style={{ paddingLeft: "2rem", marginTop: "0.5rem" }}>
                                    {loading[index] ? (
                                        <Loading />
                                    ) : (
                                        reports[index].sections.map((section, i) => (
                                            <div key={i}>{/* FormSection 렌더 */}</div>
                                        ))
                                    )}
                                </div>
                            )}
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