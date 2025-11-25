import styled from "@emotion/styled";
import type { Bar } from "@/shared/types";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: 5rem;
    margin: 0 auto;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    flex: 1;
`;

export const BtnGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

export const AddButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #4B4B4B;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #333;
    }
`;

export const MonthlyTestButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #5B8DEF;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #4A7BD8;
    }
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

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const ModalContent = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const ModalTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: #4B4B4B;
    margin: 0;
`;

export const ModalInput = styled.input`
    padding: 1rem;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;

    &:focus {
        border-color: #4B4B4B;
    }

    &::placeholder {
        color: #B2B2B2;
    }
`;

export const ModalButton = styled.button`
    padding: 1rem;
    background-color: #4B4B4B;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #333;
    }
`;
