"use client";

import * as _ from "./style";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Pagination from "@/components/pagination";
import { useState } from "react";

export default function Tnotice() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(0 / 10);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <_.Container>
            <_.TitleGroup>
                <_.Group>
                    <_.Title>공지사항</_.Title>
                    <_.SearchWrapper>
                        <Image src="/assets/search.svg" alt="search" width={18} height={18} />
                        <input type="text" placeholder="공지사항 검색" />
                    </_.SearchWrapper>
                </_.Group>
                <_.Btn onClick={() => router.push("/noticeWrite")}>공지등록</_.Btn>
            </_.TitleGroup>
            <_.NoticeContainer>
            </_.NoticeContainer>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </_.Container>
    );
}
