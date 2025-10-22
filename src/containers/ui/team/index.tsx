import * as _ from './style';
import { majorClubs, freeClubs } from './data';
import type { ClubGroupProps } from '@/types/list';

function ClubGroup({ title, clubs }: ClubGroupProps) {
    return (
        <_.Wrapper>
            <_.Text>{title}</_.Text>
            <_.Group>
                {clubs.map((club, index) => (
                    <_.Box key={index}>
                        <_.Name>{club.name}</_.Name>
                        <_.Member>
                            {club.members.map((member, i) => (
                                <_.Member key={i}>
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