"use client";

import * as _ from './style'
import Image from 'next/image';
import clubs from './data';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ClubsSkeleton from './skeleton';

export default function Clubs() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleClick = (idx: number) => {
    router.push(`/clubs/${idx}`);
  }

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
    
    // 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted || isLoading) {
    return <ClubsSkeleton />;
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