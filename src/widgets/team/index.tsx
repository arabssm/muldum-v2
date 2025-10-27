import * as _ from './style';
import { majorClubs, freeClubs } from './data';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";
type ClassType = "전체" | "1반" | "2반" | "3반" | "4반";

const Groups: GroupType[] = ["전공동아리", "네트워크", "자율동아리", "졸업작품"];
const Classes: ClassType[] = ["전체", "1반", "2반", "3반", "4반"];

export default function Team() {
    const router = useRouter();
    const [activeGroup, setActiveGroup] = useState<GroupType>("전공동아리");
    const [activeClass, setActiveClass] = useState<ClassType>("전체");

    const clubs =
        activeGroup === "전공동아리"
            ? majorClubs
            : activeGroup === "자율동아리"
                ? freeClubs
                : majorClubs;

    const filteredClubs =
        activeClass === "전체"
            ? clubs
            : clubs.filter((club) => club.class === activeClass);

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
            </_.Wrapper>

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
                                    {member}
                                    {(i + 1) % 3 === 0 ? <br /> : " "}
                                </_.Member>
                            ))}
                        </_.Member>
                    </_.Box>
                ))}
            </_.BoxGroup>
        </_.Container>
    );
}