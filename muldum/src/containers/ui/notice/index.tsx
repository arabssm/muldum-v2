"use client";

import * as _ from "./style";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/pagination";
import { NoticeData } from "@/containers/ui/main/data";

export default function Notice() {
    const page = 1;
    const totalPages = 5;
    const handlePageChange = (newPage: number) => { };

    return (
        <_.Container>
            <_.Group>
                <_.Title>공지사항</_.Title>
                <_.SearchWrapper>
                    <Image src="/assets/search.svg" alt="search" width={18} height={18} />
                    <input type="text" placeholder="공지사항 검색" />
                </_.SearchWrapper>
            </_.Group>
            <_.NoticeContainer>
                {NoticeData.map((item) => (
                    <Link key={item.path} href={item.path}>
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
                ))}
            </_.NoticeContainer>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </_.Container>
    );
}