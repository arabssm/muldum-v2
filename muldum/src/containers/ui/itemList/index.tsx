"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState } from "react";
import { items } from "./data";
import { BtnPrimary, BtnSecondary } from "@/components/bottom";
import { useRouter } from "next/navigation";

export default function ItemList() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const router = useRouter();

    const handleToggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <_.Containet>
            <_.Title>우리 팀이 신청한 물품항목</_.Title>
            <_.BtnWrapper>
                <_.InfoContainer>
                    {items.map((item, index) => (
                        <_.Wrapper key={index}>
                            <_.ToggleWrapper onClick={() => handleToggle(index)}>
                                <_.State color={item.color}>{item.state}</_.State>
                                <_.ToggleImage isOpen={openIndex === index}>
                                    <Image src="/assets/toggle.svg" alt="토글" width={24} height={24} />
                                </_.ToggleImage>
                                {item.name}
                            </_.ToggleWrapper>
                            {openIndex === index && (
                                <_.Group>
                                    <_.Content>{item.link}</_.Content>
                                    <_.Content>{item.quantity}개</_.Content>
                                    <_.Content>{item.reason}</_.Content>
                                </_.Group>
                            )}
                        </_.Wrapper>
                    ))}
                </_.InfoContainer>
                <_.BtnGroup>
                    <BtnSecondary onClick={() => router.back()}>물품 더 신청하기</BtnSecondary>
                    <BtnPrimary onClick={() => router.back()}>돌아가기</BtnPrimary>
                </_.BtnGroup>
            </_.BtnWrapper>
        </_.Containet>
    );
}
