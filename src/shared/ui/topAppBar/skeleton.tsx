"use client";

import styled from '@emotion/styled';
import { Skeleton } from "@/shared/ui/skeleton";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavSection = styled.div`
  display: flex;
  gap: 2rem;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export default function TopAppBarSkeleton() {
  return (
    <Container>
      <LogoSection>
        <Skeleton width="40px" height="40px" borderRadius="50%" />
        <Skeleton width="100px" height="24px" />
      </LogoSection>
      
      <NavSection>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} width="80px" height="20px" />
        ))}
      </NavSection>
      
      <UserSection>
        <Skeleton width="32px" height="32px" borderRadius="50%" />
        <Skeleton width="60px" height="16px" />
      </UserSection>
    </Container>
  );
}