"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState } from "react";
import { items } from "./data";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import { useRouter } from "next/navigation";

export default function ItemList() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [club, setClub] = useState("");
    const [checked, setChecked] = useState<boolean[]>(() =>
        items.map(() => false)
    );
    const router = useRouter();

    const handleToggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    const handleCheckboxClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setChecked((prev) =>
            prev.map((val, i) => (i === index ? !val : val))
        );
    };

    const getCheckboxIcon = (isChecked: boolean) =>
        isChecked ? "/assets/checkbox.svg" : "/assets/nonCheck.svg";

    const clubOptions = ["나의 동아리", "반짝반짝빛나는밤"];

    return (
        <_.Container>
            <_.Title>우리 팀이 신청한 물품항목</_.Title>
            <_.SelectGroup>
                <_.SelectWrapper>
                    <_.Select
                        id="club"
                        value={club}
                        onChange={(e) => setClub(e.target.value)}
                    >
                        <option value="">전체</option>
                        {clubOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </_.Select>
                    <Image
                        src="/assets/toggle.svg"
                        alt="토글"
                        width={20}
                        height={20}
                        style={{
                            position: "absolute",
                            right: "0.5rem",
                            top: "50%",
                            transform: "translateY(-50%) rotate(90deg)",
                        }}
                    />
                </_.SelectWrapper>
            </_.SelectGroup>
            <_.BtnWrapper>
                <_.InfoContainer>
                    {items.map((item, index) => (
                        <_.Wrapper key={index}>
                            <_.ToggleWrapper onClick={() => handleToggle(index)}>
                                <Image
                                    src={getCheckboxIcon(checked[index])}
                                    alt="체크박스"
                                    width={20}
                                    height={20}
                                    style={{ marginRight: "0.5rem", cursor: "pointer" }}
                                    onClick={(e) => handleCheckboxClick(index, e)}
                                />
                                <_.State color={item.color}>{item.state}</_.State>
                                <_.ToggleImage isOpen={openIndex === index}>
                                    <Image
                                        src="/assets/toggle.svg"
                                        alt="토글"
                                        width={24}
                                        height={24}
                                    />
                                </_.ToggleImage>
                                {item.name}
                            </_.ToggleWrapper>
                            {openIndex === index && (
                                <_.Group>
                                    <_.Content>{item.link}</_.Content>
                                    <_.Content>가격 : {item.price}원</_.Content>
                                    <_.Content>{item.quantity}개</_.Content>
                                    <_.Content>{item.reason}</_.Content>
                                    <_.Content>{item.export}</_.Content>
                                    <_.Content>배송비 : {item.money}원</_.Content>
                                    {item.state === "승인 거부" && (
                                        <_.Reapply onClick={() => router.push("/reapply")}>
                                            재신청하기
                                        </_.Reapply>
                                    )}
                                </_.Group>
                            )}
                        </_.Wrapper>
                    ))}
                </_.InfoContainer>
                <_.BtnGroup>
                    <BtnSecondary>삭제</BtnSecondary>
                    <BtnPrimary onClick={() => router.back()}>돌아가기</BtnPrimary>
                </_.BtnGroup>
            </_.BtnWrapper>
        </_.Container>
    );
}