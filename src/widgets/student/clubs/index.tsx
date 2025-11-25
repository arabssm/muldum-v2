"use client";

import * as _ from './style'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ClubsSkeleton from './skeleton';
import { getCurrentGeneration, getHistoryClubs, HistoryClub } from '@/shared/api/history';

export default function Clubs() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<number | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [clubs, setClubs] = useState<HistoryClub[]>([]);


  useEffect(() => {
    setIsMounted(true);
    
    const fetchData = async () => {
      try {
        const generation = await getCurrentGeneration();
        setCurrentGeneration(generation);
      } catch (error) {
        console.error('Failed to fetch current generation:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGeneration === null) return;

    const fetchClubs = async () => {
      setIsLoading(true);
      try {
        const data = await getHistoryClubs(selectedGeneration);
        setClubs(data);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
        setClubs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, [selectedGeneration]);

  if (!isMounted || (isLoading && selectedGeneration !== null)) {
    return <ClubsSkeleton />;
  }

  const generations = currentGeneration && currentGeneration > 0
    ? Array.from({ length: currentGeneration }, (_, i) => i + 1)
    : [];

  return (
    <_.Container>
      {generations.length > 0 && (
        <_.SelectWrapper>
          <_.Select 
            value={selectedGeneration || ''} 
            onChange={(e) => setSelectedGeneration(Number(e.target.value))}
          >
            {generations.map((gen) => (
              <option key={gen} value={gen}>
                {gen}기
              </option>
            ))}
          </_.Select>
        </_.SelectWrapper>
      )}
      
      {clubs.map((club) => (
        <_.Item key={club.id}>
          <_.Title>{club.name}</_.Title>
          {club.logoUrl && (
            <_.LogoWrapper>
              <Image src={club.logoUrl} alt={club.name} width={80} height={80} />
            </_.LogoWrapper>
          )}
          <_.Content>{club.description}</_.Content>
        </_.Item>
      ))}
    </_.Container>
  );
}