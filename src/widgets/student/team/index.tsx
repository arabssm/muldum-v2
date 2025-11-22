"use client";

import * as _ from './style';
import { majorClubs, freeClubs } from './data';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TeamSkeleton from './skeleton';
import { getNetworkTeams, Team as ApiTeam } from '@/shared/api/team';

type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";
type ClassType = "전체" | "1반" | "2반" | "3반" | "4반";

const Groups: GroupType[] = ["전공동아리", "네트워크", "자율동아리", "졸업작품"];
const Classes: ClassType[] = ["전체", "1반", "2반", "3반", "4반"];

export default function Team() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeGroup, setActiveGroup] = useState<GroupType>("전공동아리");
    const [activeClass, setActiveClass] = useState<ClassType>("전체");
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [networkTeams, setNetworkTeams] = useState<ApiTeam[]>([]);

    useEffect(() => {
        setIsMounted(true);
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchNetworkTeams = async () => {
            if (activeGroup === "네트워크") {
                setIsLoading(true);
                try {
                    const response = await getNetworkTeams();
                    // API 응답이 배열인지 확인하고 안전하게 처리
                    const teams = Array.isArray(response) ? response : [];
                    setNetworkTeams(teams);
                } catch (error) {
                    console.error("Failed to fetch network teams:", error);
                    setNetworkTeams([]);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchNetworkTeams();
    }, [activeGroup]);

    const clubs =
        activeGroup === "전공동아리"
            ? majorClubs
            : activeGroup === "자율동아리"
                ? freeClubs
                : activeGroup === "네트워크"
                    ? networkTeams
                    : majorClubs;

    // clubs가 배열인지 확인
    const clubsArray = Array.isArray(clubs) ? clubs : [];

    const filteredClubs =
        activeClass === "전체"
            ? clubsArray
            : clubsArray.filter((club) => club.class === activeClass);

    if (!isMounted) return null;

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
                {pathname === "/team" && (
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
                )}
            </_.Wrapper>
            {isLoading ? (
                <TeamSkeleton />
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
        </_.Container>
    );
}