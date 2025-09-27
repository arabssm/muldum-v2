"use client";

import * as _ from "./style";
import Link from "next/link";
import { Menu, NoticeData } from "./data";
import { useRouter } from "next/navigation"; 
import Slider from "@/components/slider";

export default function Main() {
    const router = useRouter();

    return (
        <_.Container>
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
                        {NoticeData.map((item) => (
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
                        ))}
                    </_.NoticeContainer>
                </_.Wrapper>
            </_.Info>
        </_.Container>
    );
}