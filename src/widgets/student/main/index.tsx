"use client";

import * as _ from "./style";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Slider from "@/shared/ui/slider";
import MainSkeleton from "./skeleton";
import { Menu } from "./data";
import useNotices from "@/shared/hooks/useNotices";
import type { Notice } from "@/shared/types/notice";

export default function Main() {
    const router = useRouter();
    const { notices, isLoading } = useNotices();

    const getDateFromItem = (item: any): string | undefined => {
        if (!item) return undefined;
        const candidates = [ "updatedAt", "date" ];
        for (const key of candidates) {
            if (item[key]) return item[key];
        }
        return undefined;
    };

    const parseDateSafe = (dateLike: string | Date | undefined): Date | null => {
        if (!dateLike) return null;
        if (dateLike instanceof Date) {
            if (!isNaN(dateLike.getTime())) return dateLike;
            return null;
        }
        let s = String(dateLike).trim();
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(s)) {
            s = s.replace(" ", "T");
        }
        const ms = Date.parse(s);
        if (!isNaN(ms)) return new Date(ms);
        const alt = s.replace(/\./g, "-").replace(/\//g, "-").replace(" ", "T");
        const ms2 = Date.parse(alt);
        if (!isNaN(ms2)) return new Date(ms2);
        return null;
    };

    const isNew = (dateLike: string | Date | undefined): boolean => {
        const updated = parseDateSafe(dateLike);
        if (!updated) return false;
        const now = new Date();
        const diff =
            (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
    };

    return (
        <_.Container>
            {isLoading ? (
                <MainSkeleton />
            ) : (
                <>
                    <Slider />
                    <_.Info>
                        <_.Wrapper>
                            <_.Title>메뉴</_.Title>
                            {Menu.map((menu) => (
                                <Link key={menu.path} href={menu.path}>
                                    <_.Menu>
                                        <_.Title>{menu.title}</_.Title>
                                        <_.Subtitle>{menu.subtitle}</_.Subtitle>
                                    </_.Menu>
                                </Link>
                            ))}
                        </_.Wrapper>
                        <_.Wrapper>
                            <_.Group>
                                <_.Title>공지사항</_.Title>
                                <_.Subtitle onClick={() => router.push("/notice")}>
                                    전체보기
                                </_.Subtitle>
                            </_.Group>

                            <_.NoticeContainer>
                                {notices.length > 0 ? (
                                    notices.map((item: Notice, idx: number) => {
                                        const itemDate = getDateFromItem(item);
                                        const newFlag = isNew(itemDate);

                                        const badgeStyle: React.CSSProperties = {
                                            padding: "0.6rem 1.2rem",
                                            borderRadius: 999,
                                            backgroundColor: newFlag ? "#FF9B62" : "#D1D1D1",
                                            color: "#fff",
                                            fontSize: "1rem",
                                            textAlign: "center",
                                        };
                                        return (
                                            <Link key={item.path ?? idx} href={item.path || "#"}>
                                                <_.NoticeGroup>
                                                    <div style={badgeStyle}>
                                                        {newFlag ? "신규" : (item.badge ?? "")}
                                                    </div>
                                                    <_.Notice>{item.notice}</_.Notice>
                                                </_.NoticeGroup>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            height: "50vh",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "1rem",
                                            color: "#B2B2B2",
                                        }}
                                    >
                                        공지가 없습니다.
                                    </div>
                                )}
                            </_.NoticeContainer>
                        </_.Wrapper>
                    </_.Info>
                </>
            )}
        </_.Container>
    );
}