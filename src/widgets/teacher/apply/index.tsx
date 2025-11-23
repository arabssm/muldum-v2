"use client";

import * as _ from "./style";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import Image from "next/image";
import { Modal } from "@/components/modal/modal";
import { useApplyAndModalState } from "@/shared/hooks/apply";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getApprovedItems, getRejectedItems, getNotApprovedItems, approveItems, rejectItems, downloadExcel, type TeacherItem, getRejectTemplates, addRejectTemplates, deleteRejectTemplate, type RejectTemplate, getTeamApprovedItems, getTeamNotApprovedItems, getTeamRejectedItems, type TeacherItemsResponse } from "@/shared/api/items";
import { showToast } from "@/shared/ui/toast";
import { getNetworkTeamsWithItemCount, type Team } from "@/shared/api/team";

const Groups = ["승인 가능 물품 조회", "승인된 물품 조회", "거절된 물품 조회"] as const;
const Classes = ["전체", "전공동아리", "네트워크", "1반", "2반", "3반", "4반"] as const;

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

    const router = useRouter();
    const [deliveryCost, setDeliveryCost] = useState("");
    const [ruleText, setRuleText] = useState("");
    const [isNthOpen, setIsNthOpen] = useState(false);
    const [items, setItems] = useState<TeacherItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [localChecked, setLocalChecked] = useState<boolean[]>([]);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [templates, setTemplates] = useState<RejectTemplate[]>([]);
    const [newTemplate, setNewTemplate] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [isCustomReason, setIsCustomReason] = useState(false);
    const [networkTeams, setNetworkTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [newCount, setNewCount] = useState(0);
    
    const toggleNth = () => setIsNthOpen(prev => !prev);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                let response: TeacherItemsResponse = { items: [], newCount: 0 };
                
                // 네트워크 탭이고 팀이 선택된 경우
                if (activeClass === "네트워크" && selectedTeam) {
                    if (activeGroup === "승인 가능 물품 조회") {
                        response = await getTeamNotApprovedItems(selectedTeam);
                    } else if (activeGroup === "승인된 물품 조회") {
                        response = await getTeamApprovedItems(selectedTeam);
                    } else if (activeGroup === "거절된 물품 조회") {
                        response = await getTeamRejectedItems(selectedTeam);
                    }
                } else if (activeClass !== "네트워크") {
                    // 네트워크가 아닌 경우 기존 로직
                    if (activeGroup === "승인 가능 물품 조회") {
                        response = await getNotApprovedItems();
                    } else if (activeGroup === "승인된 물품 조회") {
                        response = await getApprovedItems();
                    } else if (activeGroup === "거절된 물품 조회") {
                        response = await getRejectedItems();
                    }
                }
                
                setItems(response.items || []);
                setNewCount(response.newCount || 0);
                setLocalChecked((response.items || []).map(() => false));
                console.log('Fetched items:', response.items, 'New count:', response.newCount);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [activeGroup, activeClass, selectedTeam]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getRejectTemplates();
                setTemplates(data);
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            }
        };

        fetchTemplates();
    }, []);

    useEffect(() => {
        const fetchNetworkTeams = async () => {
            if (activeClass === "네트워크") {
                try {
                    const teams = await getNetworkTeamsWithItemCount();
                    setNetworkTeams(teams);
                } catch (error) {
                    console.error('Failed to fetch network teams:', error);
                }
            }
        };

        fetchNetworkTeams();
    }, [activeClass]);

    const handleApprove = async () => {
        const selectedItems = items.filter((_, index) => localChecked[index]);
        
        if (selectedItems.length === 0) {
            showToast.warning("승인할 물품을 선택해주세요.");
            return;
        }

        if (!confirm(`${selectedItems.length}개 물품을 승인하시겠습니까?`)) {
            return;
        }

        try {
            const itemIds = selectedItems.map(item => item.item_id);
            await approveItems(itemIds);
            showToast.success("물품이 승인되었습니다.");
            
            // 목록 새로고침
            const response = await getNotApprovedItems();
            setItems(response.items || []);
            setNewCount(response.newCount || 0);
            setLocalChecked((response.items || []).map(() => false));
        } catch (error) {
            console.error('Failed to approve items:', error);
            showToast.error("승인에 실패했습니다.");
        }
    };

    const handleReject = () => {
        const selectedItems = items.filter((_, index) => localChecked[index]);
        
        if (selectedItems.length === 0) {
            showToast.warning("거절할 물품을 선택해주세요.");
            return;
        }

        setSelectedTemplate(null);
        setIsCustomReason(false);
        setRejectReason("");
        setIsRejectModalOpen(true);
    };

    const handleRejectConfirm = async () => {
        const finalReason = isCustomReason ? rejectReason : selectedTemplate;
        
        if (!finalReason || !finalReason.trim()) {
            showToast.warning("거절 사유를 선택하거나 입력해주세요.");
            return;
        }

        const selectedItems = items.filter((_, index) => localChecked[index]);
        
        try {
            const rejectData = selectedItems.map(item => ({
                item_id: item.item_id,
                reason: finalReason
            }));
            
            await rejectItems(rejectData);
            showToast.success("물품이 거절되었습니다.");
            
            setIsRejectModalOpen(false);
            setRejectReason("");
            setSelectedTemplate(null);
            setIsCustomReason(false);
            
            // 목록 새로고침
            const response = await getNotApprovedItems();
            setItems(response.items || []);
            setNewCount(response.newCount || 0);
            setLocalChecked((response.items || []).map(() => false));
        } catch (error) {
            console.error('Failed to reject items:', error);
            showToast.error("거절에 실패했습니다.");
        }
    };

    const handleAddTemplate = async () => {
        if (!newTemplate.trim()) {
            showToast.warning("템플릿 내용을 입력해주세요.");
            return;
        }

        try {
            const newTemplates = await addRejectTemplates([newTemplate.trim()]);
            setTemplates([...templates, ...newTemplates]);
            setNewTemplate("");
            showToast.success("템플릿이 추가되었습니다.");
        } catch (error) {
            console.error('Failed to add template:', error);
            showToast.error("템플릿 추가에 실패했습니다.");
        }
    };

    const handleDeleteTemplate = async (templateId: number) => {
        try {
            await deleteRejectTemplate(templateId);
            setTemplates(templates.filter(t => t.id !== templateId));
            showToast.success("템플릿이 삭제되었습니다.");
        } catch (error) {
            console.error('Failed to delete template:', error);
            showToast.error("템플릿 삭제에 실패했습니다.");
        }
    };

    const handleLocalCheckboxClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalChecked(prev => prev.map((v, i) => (i === index ? !v : v)));
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
                            {label === "승인 가능 물품 조회" && newCount > 0 && (
                                <span style={{ 
                                    marginLeft: '0.5rem', 
                                    backgroundColor: '#FF9B62', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    padding: '0.2rem 0.5rem', 
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    {newCount}
                                </span>
                            )}
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
                    <_.GrayBtn onClick={() => setIsTemplateModalOpen(true)}>거절 템플릿 관리</_.GrayBtn>
                </_.TopWrapper>
            </_.Wrapper>
            {activeClass === "네트워크" && networkTeams.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <Image src="assets/arrow.svg" alt="화살표" width={24} height={24} style={{ cursor: "pointer", flexShrink: 0 }} />
                    <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        overflowX: 'auto', 
                        flex: 1,
                        padding: '0.5rem 0'
                    }}>
                        {networkTeams.map((team) => (
                            <div key={team.id} style={{ position: 'relative', flexShrink: 0 }}>
                                <_.Btn 
                                    onClick={() => setSelectedTeam(team.id)}
                                    style={{
                                        backgroundColor: selectedTeam === team.id ? '#FF9B62' : undefined,
                                        color: selectedTeam === team.id ? 'white' : undefined,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {team.name}
                                </_.Btn>
                                {activeGroup === "승인 가능 물품 조회" && (team.newCount ?? 0) > 0 && (
                                    <span style={{ 
                                        position: 'absolute',
                                        top: '-0.5rem',
                                        right: '-0.5rem',
                                        backgroundColor: '#FF9B62', 
                                        color: 'white', 
                                        borderRadius: '50%', 
                                        minWidth: '1.5rem',
                                        height: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        padding: '0 0.3rem',
                                        zIndex: 10,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}>
                                        {team.newCount}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <Image src="assets/arrow.svg" alt="화살표" width={24} height={24} style={{ transform: "rotate(180deg)", cursor: "pointer", flexShrink: 0 }} />
                </div>
            )}
            <_.InfoContainer>
                {loading ? (
                    <div style={{ padding: "2rem", textAlign: "center" }}>로딩 중...</div>
                ) : items.length === 0 ? (
                    <div style={{ padding: "2rem", textAlign: "center" }}>물품이 없습니다</div>
                ) : (
                    items.map((item, index) => (
                        <_.InfoWrapper key={item.item_id}>
                            <_.ToggleWrapper onClick={() => handleToggle(index)}>
                                <Image
                                    src={getCheckboxIcon(localChecked[index])}
                                    alt="체크박스"
                                    width={20}
                                    height={20}
                                    style={{ marginRight: "0.5rem", cursor: "pointer" }}
                                    onClick={(e) => handleLocalCheckboxClick(index, e)}
                                />
                                <_.State color={item.status === 'APPROVED' ? '#4CAF50' : item.status === 'REJECTED' ? '#f44336' : '#FFA500'}>
                                    {item.status === 'APPROVED' ? '승인' : item.status === 'REJECTED' ? '거절' : '대기'}
                                </_.State>
                                <_.ToggleImage isOpen={openIndex === index}>
                                    <Image src="/assets/toggle.svg" alt="토글" width={24} height={24} />
                                </_.ToggleImage>

                                {item.product_name}
                            </_.ToggleWrapper>

                            {openIndex === index && (
                                <_.InfoGroup>
                                    <_.Content 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (item.productLink) {
                                                window.open(item.productLink, '_blank');
                                            }
                                        }}
                                        style={{ cursor: item.productLink ? 'pointer' : 'default' }}
                                    >
                                        가격: {item.price}원
                                    </_.Content>
                                    <_.Content>{item.quantity}개</_.Content>
                                    <_.Content>신청 사유: {item.reason}</_.Content>
                                    <_.Content>{new Date(item.deliveryTime).toLocaleDateString()} 도착예정</_.Content>
                                    <_.Content>배송비: {item.deliveryPrice}원</_.Content>
                                    {item.status === 'REJECTED' && item.rejectReason && <_.Content style={{ color: '#f44336' }}>거절 사유: {item.rejectReason}</_.Content>}
                                </_.InfoGroup>
                            )}
                        </_.InfoWrapper>
                    ))
                )}
            </_.InfoContainer>

            <_.BtnWrapper>
                <BtnSecondary onClick={handleReject}>거절</BtnSecondary>
                <BtnPrimary onClick={handleApprove}>승인</BtnPrimary>
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

            <Modal isOpen={isRejectModalOpen} closeModal={() => setIsRejectModalOpen(false)}>
                <_.ModalInner>
                    <_.ModalTitle>거절 사유를 선택하세요</_.ModalTitle>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <select
                            value={selectedTemplate || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "기타") {
                                    setIsCustomReason(true);
                                    setSelectedTemplate(null);
                                } else {
                                    setSelectedTemplate(value);
                                    setIsCustomReason(false);
                                }
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                border: '1px solid #D1D1D1',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">거절 사유를 선택하세요</option>
                            {templates.map((template) => (
                                <option key={template.id} value={template.content}>
                                    {template.content}
                                </option>
                            ))}
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    {isCustomReason && (
                        <_.Input
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="거절 사유를 입력하세요"
                        />
                    )}
                    <_.Row>
                        <_.NoBtn onClick={() => setIsRejectModalOpen(false)}>취소</_.NoBtn>
                        <_.SaveBtn onClick={handleRejectConfirm}>확인</_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>

            <Modal isOpen={isTemplateModalOpen} closeModal={() => setIsTemplateModalOpen(false)}>
                <_.ModalInner>
                    <_.ModalTitle>거절 템플릿 관리</_.ModalTitle>
                    <div style={{ marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
                        {templates.map((template) => (
                            <div key={template.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                <span>{template.content}</span>
                                <_.NoBtn 
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                >
                                    삭제
                                </_.NoBtn>
                            </div>
                        ))}
                    </div>
                    <_.Input
                        value={newTemplate}
                        onChange={(e) => setNewTemplate(e.target.value)}
                        placeholder="새 템플릿을 입력하세요"
                    />
                    <_.Row>
                        <_.NoBtn onClick={() => setIsTemplateModalOpen(false)}>닫기</_.NoBtn>
                        <_.SaveBtn onClick={handleAddTemplate}>추가</_.SaveBtn>
                    </_.Row>
                </_.ModalInner>
            </Modal>
        </_.Container>
    );
}