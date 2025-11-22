import styled from "@emotion/styled";
import { Bar } from "@/shared/types";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2rem;
    padding: 1rem 0;
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

export const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

export const ModalTitle = styled.h4`
  font-size: 1.25rem;
  line-height: 1.4;
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e7e8ea;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  color: #333;

  ::placeholder {
    color: #b2b2b2;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
`;

export const SaveBtn = styled.button`
  padding: 0.6rem 1.25rem;
  background: #ff9b62;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #ff8640;
  }
`;

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const TeamCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #D1D1D1;
  padding: 1rem;
  border-radius: 4px;
`;

export const TeamName = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

export const MemberList = styled.div`
  font-size: 0.8rem;
  color: #B2B2B2;
`;

export const EmptyText = styled.div`
  margin-top: 20%;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  color: #B2B2B2;
`;

export const AddBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border: none;
    background-color: transparent;
    color: #B2B2B2;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        color: #545454;
    }
`;

export const GrayBtn = styled.button`
  display: flex;
  justify-content: end;
  align-items: center;
  width: 11rem;
  color: #909090;
  font-size: 0.95rem;
  background-color: transparent;
  border: none;
  cursor: pointer;

  :hover {
    color: #3F3F3F;
  }
`;

export const TabWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;


export const LeftGroup = styled.div`
  display: flex; 
  align-items: center;
`;