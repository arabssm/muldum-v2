import styled from "@emotion/styled";
import { Bar } from "@/shared/types";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2rem;
    padding: 1rem 0;
`;

export const TabWrapper = styled.div`
  display: flex;
`;

export const ClassText = styled.div<Bar>`
  display: flex;
  padding: 0.75rem;
  font-size: 1.125rem;
  font-weight: ${({ isActive }) => (isActive ? 500 : 400)};
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? "#4B4B4B" : "#B2B2B2")};
  border-bottom: 2.5px solid ${({ isActive }) => (isActive ? "#4B4B4B" : "#B2B2B2")};

  &:hover {
    background-color: ${({ isActive }) =>
      isActive ? "transparent" : "#f5f5f5b6"};
  }
`;