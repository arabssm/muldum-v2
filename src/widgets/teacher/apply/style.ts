import styled from "@emotion/styled";
import type { Bar } from "@/shared/types";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
    gap: 3rem;
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
`;

export const BtnGroup = styled.div`
    display: flex;
    align-items: center;
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

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
`;

export const State = styled.span<{ color: string }>`
  display: flex;
  font-size: 1.075rem;
  color: ${({ color }) => color};
`;

export const ToggleImage = styled.div<{ isOpen: boolean }>`
  display: flex;
  transition: transform 0.3s ease;
  transform: rotate(${props => (props.isOpen ? "90deg" : "0deg")});
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.6rem;
  padding-left: 0;

  & > div {
    display: flex;
    gap: 7rem;
  }

  & > div::before {
    content: "";
    display: inline-block;
    width: 1.2rem;
    flex-shrink: 0;
  }
`;

export const GrayBtn = styled.button`
  padding: 0;
  width: 10rem;
  color: #909090;
  font-size: 0.95rem;
  background-color: transparent;
  border: none;
  cursor: pointer;

  :hover {
    color: #3F3F3F;
  }
`;

export const Content = styled.div`
  display: block;
  font-size: 1rem;
  line-height: 1.4;
`;

export const UnContent = styled.div`
  display: block;
  font-size: 1rem;
  line-height: 1.4;
  text-decoration: underline;
  text-underline-offset: 1px;
  color: #3300FF;
`;

export const BtnWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: 1rem;
`;

export const TopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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

export const SmallText = styled.div`
  color: #b2b2b2;
  font-size: 0.9rem;
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