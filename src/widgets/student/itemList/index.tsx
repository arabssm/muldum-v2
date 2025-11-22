"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState, useEffect } from "react";
import { items } from "./data";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import { useApplyAndModalState } from "@/shared/hooks/apply";

const Groups = ["임시신청", "최종신청"] as const;
import { getItemList } from "@/shared/api/items";

export default function ItemList() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { activeGroup, setActiveGroup } = useApplyAndModalState();
    const [club, setClub] = useState("");
    const [itemsData, setItemsData] = useState<any[]>(items);
    const [checked, setChecked] = useState<boolean[]>(() =>
        items.map(() => false)
    );
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const isTemp = activeGroup === "임시신청";
                const data = await getItemList(isTemp);
                console.log('물품 목록:', data);
                
                // API 데이터를 UI 형식에 맞게 변환
                const transformedData = data.map((item: any) => {
                    let state = "승인 대기";
                    let color = "#B2B2B2";
                    
                    if (item.status === "APPROVED") {
                        state = "승인 완료";
                        color = "#60D18F";
                    } else if (item.status === "REJECTED") {
                        state = "승인 거부";
                        color = "#DF3636";
                    }
                    
                    // 날짜 포맷 변환 (2025-11-19T00:00:00 -> 11/19(화))
                    let exportDate = "-";
                    if (item.deliveryTime) {
                        const date = new Date(item.deliveryTime);
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
                        const weekday = weekdays[date.getDay()];
                        exportDate = `${month}/${day}(${weekday})`;
                    }
                    
                    return {
                        id: item.id,
                        state,
                        color,
                        price: item.price?.toLocaleString() || "0",
                        name: item.product_name,
                        link: item.productLink || item.product_link || "-",
                        quantity: item.quantity,
                        export: exportDate,
                        money: item.deliveryPrice || item.delivery_price || "0",
                        reason: item.reason || item.rejectReason || "-",
                    };
                });
                
                setItemsData(transformedData);
                setChecked(transformedData.map(() => false));
            } catch (error) {
                console.error('물품 목록 조회 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItems();
    }, [activeGroup]);

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
            <_.BarGroup>
                {Groups.map((label) => (
                    <_.ClassText
                        key={label}
                        isActive={activeGroup === label}
                        onClick={() => setActiveGroup(label)}
                    >
                        {label}
                    </_.ClassText>
                ))}
            </_.BarGroup>
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
                    {isLoading ? (
                        <div>로딩 중...</div>
                    ) : itemsData.map((item, index) => (
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
                                    <_.UnContent 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (item.link && item.link !== "-") {
                                                window.open(item.link, '_blank');
                                            }
                                        }}
                                        style={{ cursor: item.link && item.link !== "-" ? 'pointer' : 'default' }}
                                    >
                                        가격 : {item.price}원
                                    </_.UnContent>
                                    <_.Content>{item.quantity}개</_.Content>
                                    <_.Content>{item.reason}</_.Content>
                                    <_.Content>{item.export} 도착예정</_.Content>
                                    <_.Content>배송비 : {item.money}원</_.Content>
                                    {item.state === "승인 거부" && (
                                        <_.Reapply onClick={() => router.push(`/reapply?itemId=${item.id}`)}>
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