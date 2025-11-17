"use client";

import * as _ from "./style";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Slider from "@/shared/ui/slider";
import MainSkeleton from "./skeleton";
import { Menu } from "./data";
import useNotices from "@/shared/hooks/useNotices";

export default function Main() {
    const router = useRouter();
    const { notices, isLoading } = useNotices();

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
                                    notices.map((item) => (
                                        <Link key={item.path} href={item.path}>
                                            <_.NoticeGroup>
                                                <_.Badge bgColor={item.type === "new" ? "#FF9B62" : "#D1D1D1"}>
                                                    {item.badge}
                                                </_.Badge>
                                                <_.Notice>{item.notice}</_.Notice>
                                            </_.NoticeGroup>
                                        </Link>
                                    ))
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