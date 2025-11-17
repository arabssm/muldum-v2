"use client";

import * as _ from "./style";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/pagination";
import { useState } from "react";
import NoticeSkeleton from "./skeleton";
import useNotices from "@/shared/hooks/useNotices";

export default function Notice() {
    const { notices, isLoading } = useNotices();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNotices = Array.isArray(notices)
        ? notices.filter((item) =>
            item.notice.toLowerCase().includes(searchQuery.toLowerCase())
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

    return (
        <_.Container>
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
            {isLoading ? (
                <NoticeSkeleton />
            ) : (
                <>
                    <_.NoticeContainer>
                        {paginated.length > 0 ? (
                            paginated.map((item) => (
                                <Link key={item.id} href={item.path}>
                                    <_.NoticeGroup>
                                        <_.NoticeWrapper>
                                            {item.type === "new" ? (
                                                <_.Badge bgColor="#FF9B62">{item.badge}</_.Badge>
                                            ) : (
                                                <_.Badge bgColor="#D1D1D1">{item.badge}</_.Badge>
                                            )}
                                            <_.Notice>{item.notice}</_.Notice>
                                        </_.NoticeWrapper>
                                        <_.Date>{item.date}</_.Date>
                                    </_.NoticeGroup>
                                </Link>
                            ))
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