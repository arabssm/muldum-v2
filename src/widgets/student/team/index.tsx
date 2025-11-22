"use client";

import * as _ from './style';
import { freeClubs } from './data';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TeamSkeleton from './skeleton';
import { Team as ApiTeam } from '@/shared/api/team';
import { useTeams } from '@/shared/hooks/team';
import { showToast } from '@/shared/ui/toast';

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

    const isLoading = apiLoading || initialLoading;

    const handleGroupClick = (group: GroupType) => {
        if (group === "자율동아리" || group === "졸업작품") {
            showToast.error('접근할 수 없습니다');
            return;
        }
        setActiveGroup(group);
    };

    const clubs: ApiTeam[] =
        activeGroup === "전공동아리" || activeGroup === "네트워크"
            ? teams
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