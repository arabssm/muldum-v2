import * as _ from './style';
import { majorClubs, freeClubs } from './data';
import type { ClubGroupProps } from '@/shared/types/list';
import { useRouter } from 'next/navigation';

function ClubGroup({ title, clubs }: ClubGroupProps) {
    const router = useRouter();

    return (
        <_.Wrapper>
            <_.Text>{title}</_.Text>
            <_.Group>
                {clubs.map((club, index) => (
                    <_.Box key={club.id ?? index} onClick={() => router.push(`/team/${club.id ?? index}`)}>
                        <_.Name>{club.name}</_.Name>
                        <_.Member>
                            {club.members.map((member, i) => (
                                <_.Member key={`${member}-${i}`}>
                                    {member}
                                    {i % 2 === 1 ? <br /> : ' '}
                                </_.Member>
                            ))}
                        </_.Member>
                    </_.Box>
                ))}
            </_.Group>
        </_.Wrapper>
    );
}

export default function Team() {
    return (
        <_.Container>
            <ClubGroup title="전공동아리" clubs={majorClubs} />
            <ClubGroup title="자율동아리" clubs={freeClubs} />
        </_.Container>
    );
}
