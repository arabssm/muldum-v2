"use client";

import * as _ from "./style";
import Link from "next/link";
import { Menu, NoticeData } from "./data";
import { useRouter } from "next/navigation";
import Slider from "@/shared/ui/slider";
import { useState, useEffect } from "react";
import { Skeleton } from "@/shared/ui/skeleton";

export default function Main() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <_.Container>
            {isLoading ? (
                <Skeleton height="24vh" borderRadius="3.2px" />
            ) : (
                <Slider />
            )}
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
                        {isLoading ? (
                            <>
                                {Array.from({ length: 3 }).map((__, index) => (
                                    <_.NoticeGroup key={index}>
                                        <Skeleton width="50px" height="32px" borderRadius="10rem" />
                                        <Skeleton width="200px" height="20px" />
                                    </_.NoticeGroup>
                                ))}
                            </>
                        ) : (
                            NoticeData.map((item) => (
                                <Link key={item.path} href={item.path}>
                                    <_.NoticeGroup>
                                        {item.type === "new" ? (
                                            <_.Badge bgColor="#FF9B62">{item.badge}</_.Badge>
                                        ) : (
                                            <_.Badge bgColor="#D1D1D1">{item.badge}</_.Badge>
                                        )}
                                        <_.Notice>{item.notice}</_.Notice>
                                    </_.NoticeGroup>
                                </Link>
                            ))
                        )}
                    </_.NoticeContainer>
                </_.Wrapper>
            </_.Info>
        </_.Container>
    );
}