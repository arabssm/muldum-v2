"use client"

import * as _ from './style';
import Image from 'next/image';
import { useState } from 'react';
import Group from '@/components/group';
import { BtnPrimary, BtnSecondary } from "@/components/bottom";

const LockedGroups = ["자율동아리", "졸업작품"] as const;

type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";

export default function Items() {
    const [active, setActive] = useState<GroupType | null>(null);
    const [lockedMessage, setMessage] = useState<string>("");
    const [quantity, setQuantity] = useState(0);

    const increase = () => setQuantity(prev => prev + 1);
    const decrease = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));
    const icons = [{ onClick: increase, src: "/assets/Up.svg", alt: "Up" }, { onClick: decrease, src: "/assets/Drop.svg", alt: "Down" }];

    const ClickPrimary = () => alert('신청을 완료하였습니다');
    const SecondPrimary = () => alert('이동페이지개설중');

    return (
        <_.Container>
            <Group active={active} setActive={setActive} setMessage={setMessage} />

            {LockedGroups.includes(active as typeof LockedGroups[number]) ? (
                <_.MessageWrapper>
                    <Image src="/assets/nob.svg" alt="No" width={120} height={120} />
                    <_.Message>{lockedMessage}</_.Message>
                </_.MessageWrapper>
            ) : active ? (
                <>
                    <_.Group>
                        <_.Wrapper>
                            <_.Title>구입할 물품</_.Title>
                            <_.Input type="text" placeholder="구입할 물품을 입력하세요" inputWidth="40rem" />
                        </_.Wrapper>
                        <_.Wrapper>
                            <_.Title>가격</_.Title>
                            <_.Input type="text" placeholder="가격을 입력하세요" inputWidth="10rem" />
                        </_.Wrapper>
                        <_.Wrapper>
                            <_.Title>수량</_.Title>
                            <_.Number>
                                <_.Num>{quantity}</_.Num>
                                <_.Icons>
                                    {icons.map(({ onClick, src, alt }) => (
                                        <div key={alt} onClick={onClick}>
                                            <Image src={src} alt={alt} width={8} height={8} />
                                        </div>
                                    ))}
                                </_.Icons>
                            </_.Number>
                        </_.Wrapper>
                    </_.Group>
                    <_.Wrapper>
                        <_.Title>물품링크</_.Title>
                        <_.Input type="text" placeholder="링크를 입력하세요" />
                    </_.Wrapper>
                    <_.Wrapper>
                        <_.Title>신청사유</_.Title>
                        <_.Textarea placeholder="신청 사유를 10자 이상 입력해주세요" />
                    </_.Wrapper>
                    <_.BtnGroup>
                        <BtnSecondary onClick={SecondPrimary}>신청내역 보러가기</BtnSecondary>
                        <BtnPrimary onClick={ClickPrimary}>신청하기</BtnPrimary>
                    </_.BtnGroup>
                </>
            ) : (
                <_.MessageWrapper>
                    <Image src="/assets/choice.svg" alt="No" width={120} height={120} />
                    <_.Message>물품 신청을 위해 폼을 선택해주세요</_.Message>
                </_.MessageWrapper>
            )}
        </_.Container>
    );
}