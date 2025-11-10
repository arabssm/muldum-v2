"use client";

import * as _ from "./style";
import { useState } from "react";
import { items } from "@/widgets/student/itemList/data";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import Image from "next/image";

type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";
type ClassType = "전체" | "1반" | "2반" | "3반" | "4반";

const Groups: GroupType[] = ["전공동아리", "네트워크", "자율동아리", "졸업작품"];
const Classes: ClassType[] = ["전체", "1반", "2반", "3반", "4반"];

export default function Apply() {
    const [activeGroup, setActiveGroup] = useState<GroupType>("전공동아리");
    const [activeClass, setActiveClass] = useState<ClassType>("전체");
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

    const handleToggle = (index: number) => setOpenIndex(prev => prev === index ? null : index);
    const handleCheckboxClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setChecked(prev => prev.map((val, i) => (i === index ? !val : val)));
    };
    const getCheckboxIcon = (isChecked: boolean) => isChecked ? "/assets/checkbox.svg" : "/assets/nonCheck.svg";

    return (
        <_.Container>
            <_.Wrapper>
                <_.Group>
                    {Groups.map(label => (
                        <_.ClassText
                            key={label}
                            isActive={activeGroup === label}
                            onClick={() => setActiveGroup(label)}
                        >
                            {label}
                        </_.ClassText>
                    ))}
                </_.Group>
                <_.Group>
                    {Classes.map(label => (
                        <_.ClassText
                            key={label}
                            isActive={activeClass === label}
                            onClick={() => setActiveClass(label)}
                        >
                            {label}
                        </_.ClassText>
                    ))}
                </_.Group>
            </_.Wrapper>
            <_.BtnGroup>
                <_.Btn>아라</_.Btn>
                <_.Btn>인서트</_.Btn>
                <_.Btn>테라</_.Btn>
            </_.BtnGroup>
            <_.InfoContainer>
                {items.map((item, index) => (
                    <_.InfoWrapper key={index}>
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
                            <_.InfoGroup>
                                <_.Content>{item.link}</_.Content>
                                <_.Content>{item.quantity}개</_.Content>
                                <_.Content>{item.reason}</_.Content>
                            </_.InfoGroup>
                        )}
                    </_.InfoWrapper>
                ))}
            </_.InfoContainer>
            <_.BtnWrapper>
                <BtnSecondary>거절</BtnSecondary>
                <BtnPrimary>승인</BtnPrimary>
            </_.BtnWrapper>
        </_.Container>
    );
}