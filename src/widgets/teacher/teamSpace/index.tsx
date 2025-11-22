import * as _ from './style';
import { useState, useEffect } from 'react';
import MonthCheck from '@/widgets/teacher/monthCheck';
import { Modal } from '@/components/modal/modal';
import Image from 'next/image';
import type { Team } from "@/shared/types/team"

type ItemType = "월말평가" | "학생추가";

export default function Tteamspace() {
    const Groups: ItemType[] = ["월말평가", "학생추가"];
    const [activeGroup, setActiveGroup] = useState<ItemType>("월말평가");
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);

    const handleSave = () => {
        if (!title.trim() || !name.trim()) {
            alert('팀명과 학번이름을 모두 입력하세요');
            return;
        }
        const newTeam = { teamName: title, members: name };
        setTeams((prev) => [...prev, newTeam]);
        setIsOpen(false);
        setTitle('');
        setName('');
    };

    useEffect(() => {
        if (activeGroup === "학생추가") {
            setIsOpen(false);
        }
    }, [activeGroup]);

    return (
        <_.Container>
            <_.TabWrapper>
                <_.LeftGroup>
                    {Groups.map((group) => (
                        <_.ClassText
                            key={group}
                            isActive={activeGroup === group}
                            onClick={() => setActiveGroup(group)}
                        >
                            {group}
                        </_.ClassText>
                    ))}
                </_.LeftGroup>
                <_.GrayBtn>
                    구글시트 첨부
                </_.GrayBtn>
            </_.TabWrapper>
            {activeGroup === "월말평가" && <MonthCheck />}
            {activeGroup === "학생추가" && (
                <>
                    <_.AddBtn onClick={() => setIsOpen(true)}>
                        <Image src="/assets/plus.svg" alt="플러스 아이콘" width={20} height={20} />
                        팀 추가하기
                    </_.AddBtn>
                    <_.TeamList>
                        {teams.length === 0 ? (
                            <_.EmptyText>등록된 팀이 없습니다.</_.EmptyText>
                        ) : (
                            teams.map((team, index) => (
                                <_.TeamCard key={index}>
                                    <_.TeamName>{team.teamName}</_.TeamName>
                                    <_.MemberList>{team.members}</_.MemberList>
                                </_.TeamCard>
                            ))
                        )}
                    </_.TeamList>
                    <Modal
                        isOpen={isOpen}
                        closeModal={() => setIsOpen(false)}
                    >
                        <_.ModalInner>
                            <Image src="/assets/plus.svg" alt="플러스 아이콘" width={48} height={48} />
                            <_.ModalTitle>
                                학생 팀 단일 추가하기 <br /> 팀명과 학번이름을 입력하세요
                            </_.ModalTitle>
                            <_.ModalInput
                                placeholder="팀명을 입력하세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            />
                            <_.ModalInput
                                placeholder="학번이름을 입력하세요 (예: 2301 김예빈, 2302 이현우)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            />
                            <_.Row>
                                <_.SaveBtn onClick={handleSave}>등록하기</_.SaveBtn>
                            </_.Row>
                        </_.ModalInner>
                    </Modal>
                </>
            )}
        </_.Container>
    );
}