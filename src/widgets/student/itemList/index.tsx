"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState, useEffect } from "react";
import { items } from "./data";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import { useRouter } from "next/navigation";
const Groups = ["임시신청", "최종신청"] as const;
import { getItemList, submitFinalItems, deleteTempItems, deleteItem } from "@/shared/api/items";
import { showToast } from "@/shared/ui/toast";
import Loading from "@/shared/ui/loading";

export default function ItemList() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeGroup, setActiveGroup] = useState<"임시신청" | "최종신청">("임시신청");
    const [itemsData, setItemsData] = useState<any[]>([]);
    const [originalData, setOriginalData] = useState<any[]>([]); // 원본 API 데이터 저장
    const [checked, setChecked] = useState<boolean[]>([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const isTemp = activeGroup === "임시신청";
                const data = await getItemList(isTemp);
                
                // API 데이터를 UI 형식에 맞게 변환
                // 원본 데이터 저장
                setOriginalData(data);
                
                const transformedData = data.map((item: any) => {
                    let state = "임시 신청";
                    let color = "#FFA500";
                    
                    if (item.status === "APPROVED") {
                        state = "승인 완료";
                        color = "#60D18F";
                    } else if (item.status === "REJECTED") {
                        state = "승인 거부";
                        color = "#DF3636";
                    } else if (item.status === "PENDING") {
                        state = "승인 대기";
                        color = "#B2B2B2";
                    } else if (item.status === "INTEMP") {
                        state = "임시 신청";
                        color = "#FFA500";
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
                        status: item.status,
                        price: typeof item.price === 'string' ? parseInt(item.price).toLocaleString() : item.price?.toLocaleString() || "0",
                        name: item.product_name,
                        link: item.product_link || "-",
                        quantity: item.quantity,
                        export: exportDate,
                        money: item.deliveryPrice || "0",
                        reason: item.reason || "-",
                        rejectReason: item.rejectReason || null,
                    };
                });
                
                setItemsData(transformedData);
                setChecked(transformedData.map(() => false));
                setIsAllChecked(false);
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
        setChecked((prev) => {
            const newChecked = prev.map((val, i) => (i === index ? !val : val));
            setIsAllChecked(newChecked.every(c => c));
            return newChecked;
        });
    };

    const handleSelectAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newValue = !isAllChecked;
        setIsAllChecked(newValue);
        setChecked(itemsData.map(() => newValue));
    };

    const getCheckboxIcon = (isChecked: boolean) =>
        isChecked ? "/assets/checkbox.svg" : "/assets/nonCheck.svg";

    const handleFinalSubmit = async () => {
        if (itemsData.length === 0) {
            showToast.warning("임시 신청된 물품이 없습니다.");
            return;
        }

        // 체크된 항목만 신청할지, 전체를 신청할지 확인
        const checkedIndices = checked.map((c, i) => c ? i : -1).filter(i => i !== -1);
        const checkedItemIds = checkedIndices.map(i => itemsData[i]?.id).filter(Boolean);

        const message = checkedItemIds.length > 0 
            ? `선택한 ${checkedItemIds.length}개 물품을 최종 신청하시겠습니까?`
            : "모든 임시 신청 물품을 최종 신청하시겠습니까?";

        if (!confirm(message)) {
            return;
        }

        try {
            const result = await submitFinalItems(checkedItemIds.length > 0 ? checkedItemIds : undefined);
            if (result.status === "PENDING") {
                showToast.success(result.message || "최종 신청이 완료되었습니다!");
                // 목록 새로고침
                const data = await getItemList(true);
                setItemsData(data);
                setChecked(data.map(() => false));
            } else {
                showToast.error(result.message || "최종 신청에 실패했습니다.");
            }
        } catch (error) {
            console.error("최종 신청 실패:", error);
            showToast.error("최종 신청 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async () => {
        const checkedIndices = checked.map((c, i) => c ? i : -1).filter(i => i !== -1);
        
        if (checkedIndices.length === 0) {
            showToast.warning("삭제할 물품을 선택해주세요.");
            return;
        }

        const checkedItemIds = checkedIndices.map(i => itemsData[i]?.id).filter(Boolean);

        if (!confirm(`선택한 ${checkedItemIds.length}개 물품을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            if (activeGroup === "임시신청") {
                // 임시 물품 일괄 삭제
                const result = await deleteTempItems(checkedItemIds);
                if (result.status === "INTEMP") {
                    showToast.success(result.message || "삭제되었습니다.");
                } else {
                    showToast.error(result.message || "삭제에 실패했습니다.");
                }
            } else {
                // 제출된 물품 개별 삭제
                await Promise.all(checkedItemIds.map(id => deleteItem(id)));
                showToast.success("삭제되었습니다.");
            }
            
            // 목록 새로고침
            const isTemp = activeGroup === "임시신청";
            const data = await getItemList(isTemp);
            setItemsData(data);
            setChecked(data.map(() => false));
        } catch (error) {
            console.error("삭제 실패:", error);
            showToast.error("삭제 중 오류가 발생했습니다.");
        }
    };

    const handleEditItem = (item: any) => {
        // 원본 데이터에서 해당 아이템 찾기
        const originalItem = originalData.find((d: any) => d.id === item.id);
        
        if (originalItem) {
            // URL에 데이터를 인코딩해서 전달
            const dataStr = encodeURIComponent(JSON.stringify(originalItem));
            router.push(`/itemEdit?itemId=${item.id}&data=${dataStr}`);
        } else {
            showToast.error("물품 정보를 찾을 수 없습니다.");
        }
    };

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
            <_.BtnWrapper>
                {activeGroup === "임시신청" && itemsData.length > 0 && !isLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem', cursor: 'pointer', padding: '0.25rem 0' }} onClick={handleSelectAll}>
                        <Image
                            src={getCheckboxIcon(isAllChecked)}
                            alt="전체선택"
                            width={20}
                            height={20}
                            style={{ marginRight: "0.5rem" }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>전체선택</span>
                    </div>
                )}
                <_.InfoContainer>
                    {isLoading ? (
                        <div><Loading /></div>
                    ) : itemsData.map((item, index) => (
                        <_.Wrapper key={index}>
                            <_.ToggleWrapper onClick={() => handleToggle(index)}>
                                {activeGroup === "임시신청" && (
                                    <Image
                                        src={getCheckboxIcon(checked[index])}
                                        alt="체크박스"
                                        width={20}
                                        height={20}
                                        style={{ marginRight: "0.5rem", cursor: "pointer" }}
                                        onClick={(e) => handleCheckboxClick(index, e)}
                                    />
                                )}
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
                                        가격: {item.price}원
                                    </_.UnContent>
                                    <_.Content>{item.quantity}개</_.Content>
                                    <_.Content>{item.reason}</_.Content>
                                    <_.Content>{item.export} 도착예정</_.Content>
                                    <_.Content>배송비: {item.money}원</_.Content>
                                    {item.status === "REJECTED" && item.rejectReason && (
                                        <_.Content style={{ color: '#DF3636' }}>거절 사유: {item.rejectReason}</_.Content>
                                    )}
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {activeGroup === "임시신청" && (
                                            <_.Reapply onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditItem(item);
                                            }}>
                                                수정하기
                                            </_.Reapply>
                                        )}
                                        {item.state === "승인 거부" && (
                                            <_.Reapply onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/reapply?itemId=${item.id}`);
                                            }}>
                                                재신청하기
                                            </_.Reapply>
                                        )}
                                    </div>
                                </_.Group>
                            )}
                        </_.Wrapper>
                    ))}
                </_.InfoContainer>
                <_.BtnGroup>
                    {activeGroup === "임시신청" && (
                        <BtnSecondary onClick={handleDelete}>삭제</BtnSecondary>
                    )}
                    {activeGroup === "임시신청" && (
                        <BtnPrimary onClick={handleFinalSubmit}>최종 신청</BtnPrimary>
                    )}
                    <BtnPrimary onClick={() => router.back()}>돌아가기</BtnPrimary>
                </_.BtnGroup>
            </_.BtnWrapper>
        </_.Container>
    );
}