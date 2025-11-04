import styled from "@emotion/styled";
import type { Bar } from "@/shared/types";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: 5rem;
    margin: 0 auto;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const Text = styled.div`
    display: flex;
    font-size: 1.5rem;
    font-weight: 600;
`;

export const Group = styled.div`
    display: flex;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.5rem;
`;

export const BoxGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    width: 100%;
`;

export const Box = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 2rem 1.8rem;
    background-color: #FAFAFA;
    border-radius: 4px;
    cursor: pointer;
`;

export const Name = styled.div`
    display: flex;
    font-size: 1.25rem;
    font-weight: 500;
`;

export const Member = styled.div`
    display: flex;
    flex-wrap: wrap;
    font-size: 1rem;
    color: #909090;
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
