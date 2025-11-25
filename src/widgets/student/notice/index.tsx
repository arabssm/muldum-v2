"use client";

import * as _ from "./style";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pagination from "@/components/pagination";
import { useState, useEffect } from "react";
import Loading from "@/shared/ui/loading";
import useNotices from "@/shared/hooks/useNotices";
import { getUserInfo } from "@/shared/api/user";

export default function Notice() {
    const { notices, isLoading } = useNotices();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);

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

    const filteredNotices = Array.isArray(notices)
        ? notices.filter((item) =>
            item.notice?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const totalPages = Math.ceil(filteredNotices.length / 10);
    const start = (page - 1) * 10;
    const paginated = filteredNotices.slice(start, start + 10);

    const handlePageChange = (newPage: number) => setPage(newPage);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const router = useRouter();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const userInfo = await getUserInfo();
                setUserRole(userInfo.user_type);
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
            }
        };

        fetchUserRole();
    }, []);

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
                            onChange={handleSearchChange}
                        />
                    </_.SearchWrapper>
                </_.Group>

                {userRole === "TEACHER" && (
                    <_.Btn onClick={() => router.push("/noticeWrite")}>
                        공지등록
                    </_.Btn>
                )}
            </_.TitleGroup>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <_.NoticeContainer>
                        {paginated.length > 0 ? (
                            paginated.map((item) => {
                                const itemDate = getDateFromItem(item);
                                const newFlag = isNew(itemDate);

                                return (
                                    <Link key={item.id} href={item.path}>
                                        <_.NoticeGroup>
                                            <_.NoticeWrapper>
                                                <div
                                                    style={{
                                                        padding: "0.6rem 1.2rem",
                                                        borderRadius: 999,
                                                        backgroundColor: newFlag ? "#FF9B62" : "#D1D1D1",
                                                        color: "#fff",
                                                        fontSize: "1rem",
                                                        textAlign: "center",
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
                                    </Link>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    height: "65vh",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "1rem",
                                    color: "#B2B2B2",
                                }}
                            >
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </_.NoticeContainer>
                    {filteredNotices.length > 0 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </_.Container>
    );
}