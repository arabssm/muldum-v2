"use client";

import * as _ from "./style";
import { items } from "@/widgets/student/itemList/data";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import Image from "next/image";
import { Modal } from "@/components/modal/modal";
import { useApplyAndModalState } from "@/shared/hooks/apply";

const Groups = ["승인 가능 물품 조회", "승인된 물품 조회", "거절된 물품 조회"] as const;
const Classes = ["전체", "전공동아리", "1반", "2반", "3반", "4반"] as const;

export default function Apply() {
    const {
        activeGroup, activeClass,
        openIndex, checked, setActiveGroup,
        setActiveClass, handleToggle, handleCheckboxClick,
        getCheckboxIcon, isOpen,
        setIsOpen, handleSave, isNoticeOpen,
        noticeText, setIsNoticeOpen,
        setNoticeText, handleSaveNotice,
    } = useApplyAndModalState();

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
                    <_.GrayBtn onClick={() => setIsNoticeOpen(true)}>주의사항 작성</_.GrayBtn>
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
                    <_.ModalTitle>
                        n차 물품 신청 기간 열기 <br /> 차수를 입력해주세요
                    </_.ModalTitle>
                    <_.Row>
                        <_.NoBtn onClick={() => setIsOpen(false)}>닫기</_.NoBtn>
                        <_.SaveBtn onClick={handleSave}>열기</_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>

            <Modal isOpen={isNoticeOpen} closeModal={() => setIsNoticeOpen(false)}>
                <_.ModalInner>
                    <Image src="/assets/warn.svg" alt="충고 아이콘" width={48} height={48} />
                    <_.ModalTitle>
                        학생들에게 주의사항을 <br /> 알려주세요
                    </_.ModalTitle>

                    <input
                        value={noticeText}
                        onChange={(e) => setNoticeText(e.target.value)}
                        placeholder="1. 내용을 입력하세요"
                        style={{
                            width: "100%",
                            padding: "1rem",
                            borderRadius: "4px",
                            border: "1px solid #D1D1D1",
                            outline: "none",
                            marginBottom: "1rem"
                        }}
                    />
                    <_.Row>
                        <_.NoBtn onClick={() => setIsNoticeOpen(false)}>취소</_.NoBtn>
                        <_.SaveBtn onClick={handleSaveNotice}>등록</_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}