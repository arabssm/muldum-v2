"use client";

import * as _ from './style'
import Image from 'next/image';
import clubs from './data';
import { useRouter } from 'next/navigation';

export default function Clubs() {
  const router = useRouter();
  
  const handleClick = (idx: number) => {
    router.push(`/clubs/${idx}`);
  }

  return (
    <_.Container>
      {clubs.map((club) => (
        <_.Item key={club.idx} onClick={() => handleClick(club.idx)}>
          <_.Title>{club.name}</_.Title>
          <_.PointGroup>
            <_.Point>
              <Image src="/assets/medal.svg" alt={club.level} width={24} height={24} />
              {club.level}
            </_.Point>
          </_.PointGroup>
          <_.Content>{club.explanation}</_.Content>
        </_.Item>
      ))}
    </_.Container>
  );
}