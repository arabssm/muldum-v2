import styled from "@emotion/styled";
import type { Bar } from "@/types/main";

export const Container = styled.div`
  display: flex;
`;

export const Text = styled.div<Bar>`
  display: flex;
  padding: 0.75rem;
  font-size: 1.125rem;
  font-weight: ${({ isActive }) => (isActive ? 500 : 400)};
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? "#4B4B4B" : "#B2B2B2")};
  border-bottom: 2px solid ${({ isActive }) => (isActive ? "#4B4B4B" : "#B2B2B2")};


  &:hover {
    background-color: ${({ isActive }) =>
      isActive ? "transparent" : "#f5f5f5b6"};
  }
`;