"use client";

import * as _ from './style';
import { freeClubs } from './data';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Loading from '@/shared/ui/loading';
import { Team as ApiTeam } from '@/shared/api/team';
import { useTeams } from '@/shared/hooks/team';
import { showToast } from '@/shared/ui/toast';
import { getUserInfo } from '@/shared/api/user';
import axiosInstance from '@/shared/lib/axiosInstance';

type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";
type ClassType = "전체" | "1반" | "2반" | "3반" | "4반";

const Groups: GroupType[] = ["전공동아리", "네트워크", "자율동아리", "졸업작품"];
const Classes: ClassType[] = ["전체", "1반", "2반", "3반", "4반"];

export default function Team() {
    const router = useRouter();
    const pathname = usePathname();

    const [activeGroup, setActiveGroup] = useState<GroupType>("전공동아리");
    const [activeClass, setActiveClass] = useState<ClassType>("전체");
    const [isMounted, setIsMounted] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [userType, setUserType] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'student' | 'team'>('student');
    const [googleSheetUrl, setGoogleSheetUrl] = useState("");

    const { teams, isLoading: apiLoading } = useTeams(
        activeGroup === "전공동아리" || activeGroup === "네트워크"
            ? activeGroup
            : "전공동아리"
    );

    useEffect(() => {
        setIsMounted(true);
        const timer = setTimeout(() => setInitialLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                const userInfo = await getUserInfo();
                setUserType(userInfo.user_type);
            } catch (error) {
                console.error('Failed to fetch user type:', error);
            }
        };
        fetchUserType();
    }, []);

    const isLoading = apiLoading || initialLoading;

    const handleGroupClick = (group: GroupType) => {
        if (group === "자율동아리" || group === "졸업작품") {
            showToast.error('접근할 수 없습니다');
            return;
        }
        setActiveGroup(group);
    };

    const openModal = (type: 'student' | 'team') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleAddUrl = async () => {
        if (!googleSheetUrl.trim()) {
            showToast.error('URL을 입력해주세요');
            return;
        }

        try {
            let response;
            if (modalType === 'student') {
                response = await axiosInstance.post('/tch/student/invite', {
                    googleSheetUrl: googleSheetUrl,
                });
            } else {
                response = await axiosInstance.post('/tch/teamspace/invite', {
                    googleSheetUrl: googleSheetUrl,
                });
            }
            
            setGoogleSheetUrl("");
            setIsModalOpen(false);
            showToast.success("추가되었습니다!");
            
            // 201 응답이면 새로고침
            if (response.status === 201) {
                window.location.reload();
            }
        } catch (err) {
            console.error('추가 실패:', err);
            showToast.error("추가에 실패했습니다.");
        }
    };

    const handleMonthlyTestClick = () => {
        router.push('/monthlyTest');
    };

    // 학번에서 반 추출 함수 (예: 2111 → 1반, 2212 → 2반, 2312 → 3반, 2401 → 4반)
    const getClassFromStudentId = (studentId?: string): string | null => {
        if (!studentId || studentId.length < 4) {
            console.log('Invalid studentId:', studentId);
            return null;
        }
        // 학번 형식: YCNN (Y=학년 첫자리, C=반, NN=번호)
        // 2111 → 2(학년) 1(반) 11(번호) → 1반
        // 2212 → 2(학년) 2(반) 12(번호) → 2반
        // 2312 → 2(학년) 3(반) 12(번호) → 3반
        
        // 두 번째 자리가 반 번호
        const classChar = studentId.charAt(1);
        console.log('StudentId:', studentId, 'charAt(1):', classChar, 'Result:', `${classChar}반`);
        
        if (classChar >= '1' && classChar <= '4') {
            return `${classChar}반`;
        }
        
        return null;
    };

    const clubs: ApiTeam[] =
        activeGroup === "전공동아리" || activeGroup === "네트워크"
            ? teams.map(team => {
                // 첫 번째 멤버의 학번으로 반 결정
                const firstMember = team.memberDetails?.[0];
                const detectedClass = firstMember?.studentId 
                    ? getClassFromStudentId(firstMember.studentId)
                    : null;
                
                console.log('Team:', team.name, 'First Member:', firstMember?.userName, 'StudentId:', firstMember?.studentId, 'Detected Class:', detectedClass);
                
                return {
                    ...team,
                    class: detectedClass || team.class
                };
            })
            : activeGroup === "자율동아리"
                ? freeClubs
                : [];

    const filteredClubs =
        activeClass === "전체"
            ? clubs
            : clubs.filter((club) => club.class === activeClass);

    if (!isMounted) return null;

    return (
        <_.Container>
            <_.Header>
                <_.Wrapper>
                    <_.Group>
                        {Groups.map((label) => (
                            <_.ClassText
                                key={label}
                                isActive={activeGroup === label}
                                onClick={() => handleGroupClick(label)}
                            >
                                {label}
                            </_.ClassText>
                        ))}
                    </_.Group>
                    {pathname === "/team" && (
                        <_.Group>
                            {(activeGroup === "전공동아리" 
                                ? ["전체"] 
                                : activeGroup === "네트워크" 
                                    ? Classes 
                                    : []
                            ).map((label) => (
                                <_.ClassText
                                    key={label}
                                    isActive={activeClass === label}
                                    onClick={() => setActiveClass(label as ClassType)}
                                >
                                    {label}
                                </_.ClassText>
                            ))}
                        </_.Group>
                    )}
                </_.Wrapper>
                <_.BtnGroup>
                    {userType === "TEACHER" && (
                        <>
                            {activeGroup === "전공동아리" && (
                                <_.MonthlyTestButton onClick={handleMonthlyTestClick}>
                                    월말평가 전체 조회
                                </_.MonthlyTestButton>
                            )}
                            <_.MonthlyTestButton onClick={() => openModal('student')}>
                                학생추가
                            </_.MonthlyTestButton>
                            <_.MonthlyTestButton onClick={() => openModal('team')}>
                                학생팀추가
                            </_.MonthlyTestButton>
                        </>
                    )}
                </_.BtnGroup>
            </_.Header>
            {isLoading ? (
                <Loading />
            ) : (
                <_.BoxGroup>
                    {filteredClubs.map((club, index) => (
                        <_.Box
                            key={club.id ?? index}
                            onClick={() => router.push(`/team/${club.id ?? index}`)}
                        >
                            <_.Name>{club.name}</_.Name>
                            <_.Member>
                                {club.members.map((member, i) => (
                                    <_.Member key={i}>
                                        {member}&nbsp;
                                        {(i + 1) % 3 === 0 ? <br /> : " "}
                                    </_.Member>
                                ))}
                            </_.Member>
                        </_.Box>
                    ))}
                </_.BoxGroup>
            )}

            {isModalOpen && (
                <_.ModalOverlay onClick={() => setIsModalOpen(false)}>
                    <_.ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <_.ModalTitle>
                            {modalType === 'student' ? '학생 초대 URL 추가' : '학생 팀원 추가 URL 추가'}
                        </_.ModalTitle>
                        <_.ModalInput
                            type="url"
                            placeholder="Google 시트 URL을 입력하세요"
                            value={googleSheetUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoogleSheetUrl(e.target.value)}
                        />
                        <_.ModalButton onClick={handleAddUrl}>추가</_.ModalButton>
                    </_.ModalContent>
                </_.ModalOverlay>
            )}
        </_.Container>
    );
}