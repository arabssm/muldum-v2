"use client";

import * as _ from "./style";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Pagination from "@/components/pagination";
import { useState } from "react";
import useNotices from "@/shared/hooks/useNotices";

export default function Tnotice() {
    const router = useRouter();
    const { notices, isLoading } = useNotices();

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const getDateFromItem = (item: any): string | undefined => {
        if (!item) return undefined;
        const candidates = ["updatedAt", "date"];
        for (const key of candidates) {
            if (item[key]) return item[key];
        }
        return undefined;
    };

    const isNew = (date?: string) => {
        if (!date) return false;
        const updated = new Date(date).getTime();
        const now = Date.now();
        const diff = now - updated;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        return diff <= sevenDays;
    };

    const filtered = Array.isArray(notices)
        ? notices.filter((item) =>
            item.notice?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const totalPages = Math.ceil(filtered.length / 10);
    const start = (page - 1) * 10;
    const paginated = filtered.slice(start, start + 10);

    return (
        <_.Container>
            <_.TitleGroup>
                <_.Group>
                    <_.Title>공지사항</_.Title>

                    <_.SearchWrapper>
                        <Image src="/assets/search.svg" alt="search" width={18} height={18} />
                        <input
                            type="text"
                            placeholder="공지사항 검색"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                        />
                    </_.SearchWrapper>
                </_.Group>

                <_.Btn onClick={() => router.push("/noticeWrite")}>
                    공지등록
                </_.Btn>
            </_.TitleGroup>

            <_.NoticeContainer>
                {isLoading ? (
                    <div>로딩중...</div>
                ) : paginated.length > 0 ? (
                    paginated.map((item) => {
                        const itemDate = getDateFromItem(item);
                        const newFlag = isNew(itemDate);

                        return (
                            <_.NoticeGroup
                                key={item.id}
                                onClick={() => router.push(`/notice/${item.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <_.NoticeWrapper>
                                    <div
                                        style={{
                                            padding: "0.6rem 1.2rem",
                                            borderRadius: 999,
                                            backgroundColor: newFlag ? "#FF9B62" : "#D1D1D1",
                                            color: "#fff",
                                            fontSize: "1rem",
                                            minWidth: "48px",
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {newFlag ? "신규" : "공지"}
                                    </div>

                                    <_.Notice>{item.notice}</_.Notice>
                                </_.NoticeWrapper>

                                <_.Date>{itemDate}</_.Date>
                            </_.NoticeGroup>
                        );
                    })
                ) : (
                    <div
                        style={{
                            display: "flex",
                            height: "60vh",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#B2B2B2",
                        }}
                    >
                        검색 결과가 없습니다.
                    </div>
                )}
            </_.NoticeContainer>

            {filtered.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                />
            )}
        </_.Container>
    );
}