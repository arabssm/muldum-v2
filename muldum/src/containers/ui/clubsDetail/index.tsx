"use client";

import * as _ from './style';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import NotFound from '@/app/not-found';
import clubs from '../clubs/data';

export default function ClubsDetail() {
  const { id } = useParams();
  const club = clubs.find((c) => c.idx === Number(id));

  if (!club) return <NotFound />;

  return (
    <_.Container>
      <_.Wrapper>
        <_.Group>
          <_.Title>{club.name}</_.Title>
          <_.Point>
            <Image src="/assets/medal.svg" alt={club.level} width={24} height={24} />
            {club.level}
          </_.Point>
        </_.Group>
        <_.Content>{club.explanation}</_.Content>
      </_.Wrapper>
      <_.ContentGroup>
        <_.Text>프로젝트 설명</_.Text>
        <_.Box />
      </_.ContentGroup>
    </_.Container>
  );
}