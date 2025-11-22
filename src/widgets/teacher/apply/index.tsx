"use client";

import * as _ from "./style";
import { items } from "@/widgets/student/itemList/data";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import Image from "next/image";
import { Modal } from "@/components/modal/modal";
import { useApplyAndModalState } from "@/shared/hooks/apply";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Groups = ["승인 가능 물품 조회", "승인된 물품 조회", "거절된 물품 조회"] as const;
const Classes = ["전체", "전공동아리", "1반", "2반", "3반", "4반"] as const;

export default function Apply() {
    const {
        activeGroup, activeClass,
        openIndex, checked, setActiveGroup,
        setActiveClass, handleToggle, handleCheckboxClick,
        getCheckboxIcon, isNoticeOpen, toggleAll,
        noticeText, setIsNoticeOpen, setIsOpen,
        setNoticeText, handleSaveNotice, searchQuery,
        handleSearchChange, isOpen, handleSave
    } = useApplyAndModalState();

    const router = useRouter()
    const [deliveryCost, setDeliveryCost] = useState("");
    const [ruleText, setRuleText] = useState("");
    const [isNthOpen, setIsNthOpen] = useState(false);
    const toggleNth = () => setIsNthOpen(prev => !prev);

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
                    <_.SearchWrapper>
                        <Image src="/assets/search.svg" alt="search" width={18} height={18} />
                        <input
                            type="text"
                            placeholder="물품 검색"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </_.SearchWrapper>
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
                    <_.GrayBtn onClick={() => router.push('/caution')}>주의사항 작성</_.GrayBtn>
                    <_.GrayBtn onClick={() => setIsOpen(true)}>규칙 추가</_.GrayBtn>
                    <_.GrayBtn onClick={toggleNth}>{isNthOpen ? "n차 물품 닫기" : "n차 물품 열기"} </_.GrayBtn>
                    <_.GrayBtn onClick={toggleAll}>전체선택</_.GrayBtn>
                    <_.GrayBtn>승인 항목 다운로드</_.GrayBtn>
                </_.TopWrapper>
            </_.Wrapper>
            <_.BtnGroup>
                <Image src="assets/arrow.svg" alt="화살표" width={24} height={24} style={{ cursor: "pointer" }} />
                <_.Btn>아라</_.Btn>
                <_.Btn>인서트</_.Btn>
                <_.Btn>테라</_.Btn>
                <Image src="assets/arrow.svg" alt="화살표" width={24} height={24} style={{ transform: "rotate(180deg)", cursor: "pointer", marginLeft: "auto" }} />
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
                    <_.ModalTitle> 택배비 및 규칙을 <br /> 추가하세요 </_.ModalTitle>
                    <_.Input
                        value={deliveryCost}
                        onChange={(e) => setDeliveryCost(e.target.value)}
                        placeholder="1. 택배비를 입력하세요"
                    />
                    <_.Input
                        value={ruleText}
                        onChange={(e) => setRuleText(e.target.value)}
                        placeholder="2. 그 외 규칙을 입력하세요"
                    />
                    <_.Row>
                        <_.NoBtn onClick={() => setIsOpen(false)}>닫기</_.NoBtn>
                        <_.SaveBtn onClick={handleSave}>
                            {isNthOpen ? "닫기" : "열기"}
                        </_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}