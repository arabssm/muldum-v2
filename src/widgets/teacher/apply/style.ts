import styled from "@emotion/styled";
import type { Bar } from "@/shared/types";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
    gap: 2.5rem;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const Group = styled.div`
    display: flex;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.5rem;
`;

export const BtnGroup = styled.div`
    display: flex;
    gap: 1rem;
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

export const Btn = styled.button`
    display: flex;
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border: 1px solid #B2B2B2;
    background-color: transparent;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #FFF5EF;
        border: 1px solid #FF9B62;
    }

    &:active {
        background-color: #FFF5EF;
        border: 1px solid #FF9B62;
    }
`;

