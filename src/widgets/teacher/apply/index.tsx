"use client";

import * as _ from "./style";
import { useState } from "react";
import { items } from "@/widgets/student/itemList/data";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import Image from "next/image";
import { Modal } from "@/components/modal/modal";

type GroupType = "승인 가능 물품 조회" | "승인된 물품 조회" | "거절된 물품 조회";
type ClassType = "전체" | "전공동아리" | "1반" | "2반" | "3반" | "4반";

const Groups: GroupType[] = ["승인 가능 물품 조회", "승인된 물품 조회", "거절된 물품 조회"];
const Classes: ClassType[] = ["전체", "전공동아리", "1반", "2반", "3반", "4반"];

export default function Apply() {
    const [activeGroup, setActiveGroup] = useState<GroupType>("승인 가능 물품 조회");
    const [activeClass, setActiveClass] = useState<ClassType>("전체");
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");

    const handleToggle = (index: number) => setOpenIndex(prev => (prev === index ? null : index));
    const handleCheckboxClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setChecked(prev => prev.map((val, i) => (i === index ? !val : val)));
    };
    const getCheckboxIcon = (isChecked: boolean) =>
        isChecked ? "/assets/checkbox.svg" : "/assets/nonCheck.svg";

    const handleSave = () => {
        if (title.trim() === "") return alert("차수를 입력해주세요");
        alert(`${title}차 물품 신청 기간이 열렸습니다.`);
        setTitle("");
        setIsOpen(false);
    };

    return (
        <_.Container>
            <_.Wrapper>
                <_.Group>
                    {Groups.map((label) => (
                        <_.ClassText
                            key={label}
                            isActive={activeGroup === label}
                            onClick={() => setActiveGroup(label)}
                        >
                            {label}
                        </_.ClassText>
                    ))}
                </_.Group>

                <_.TopWrapper>
                    <_.Group>
                        {Classes.map((label) => (
                            <_.ClassText
                                key={label}
                                isActive={activeClass === label}
                                onClick={() => setActiveClass(label)}
                            >
                                {label}
                            </_.ClassText>
                        ))}
                    </_.Group>
                    <_.GrayBtn onClick={() => setIsOpen(true)}>n차 물품 열기</_.GrayBtn>
                    <_.GrayBtn>승인 항목 다운로드</_.GrayBtn>
                    <_.GrayBtn>전체선택</_.GrayBtn>
                </_.TopWrapper>
            </_.Wrapper>
            <_.BtnGroup>
                <Image src="assets/arrow.svg" alt="화살표" width={24} height={24} style={{ cursor: "pointer" }} />
                <_.Btn>아라</_.Btn>
                <_.Btn>인서트</_.Btn>
                <_.Btn>테라</_.Btn>
                <Image src="assets/arrow.svg" alt="화살표" width={24} height={24} style={{ transform: "rotate(180deg)", cursor: "pointer", display: "block", marginLeft: "auto" }} />
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
                                <Image src="/assets/toggle.svg" alt="토글" width={24} height={24} />
                            </_.ToggleImage>
                            {item.name}
                        </_.ToggleWrapper>
                        {openIndex === index && (
                            <_.InfoGroup>
                                <_.UnContent>{item.link}</_.UnContent>
                                <_.Content>가격 : {item.price}원</_.Content>
                                <_.Content>{item.quantity}개</_.Content>
                                <_.Content>{item.reason}</_.Content>
                                <_.Content>{item.export} 도착예정</_.Content>
                                <_.Content>배송비 : {item.money}원</_.Content>
                            </_.InfoGroup>
                        )}
                    </_.InfoWrapper>
                ))}
            </_.InfoContainer>
            <_.BtnWrapper>
                <BtnSecondary>거절</BtnSecondary>
                <BtnPrimary>승인</BtnPrimary>
            </_.BtnWrapper>
            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
                <_.ModalInner>
                    <Image src="/assets/n.svg" alt="플러스 아이콘" width={48} height={48} />
                    <_.ModalTitle>n차 물품 신청 기간 열기 <br /> 차수를 입력해주세요  </_.ModalTitle>
                    <_.ModalInput
                        placeholder="차수 입력 (예: 1, 2, 3)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    />
                    <_.Row>
                        <_.SaveBtn onClick={handleSave}>열기</_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}