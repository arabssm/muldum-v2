import styled from "@emotion/styled";
import type { Bar } from "@/shared/types";

const Basic = `
  display: flex;
  align-items: center;
`;

export const Container = styled.div`
  ${Basic}
  justify-content: space-between;
  padding: 2rem 8rem 0 9rem;
`;

export const Wrapper = styled.div`
  ${Basic}
  gap: 4rem;
`;

const BaseButton = styled.a`
  ${Basic}
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10rem;
  padding: 0.6rem 1rem;
`;

export const Text = styled.a<Bar>`
  background-color: transparent;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ isActive }) => (isActive ? "#4B4B4B" : "#B2B2B2")};
  cursor: pointer;

  &:hover {
    color: #4B4B4B;
  }
`;

export const LoginBtn = styled(BaseButton)`
  border: 1px solid #4B4B4B;
  background-color: transparent;

  &:hover {
    background-color: #f6f6f6ff;
  }
`;

export const MyInfo = styled(BaseButton)`
  border: none;
  color: #fff;
  background-color: #4B4B4B;

  &:hover{
    background-color: #2d2c2cff;
  }
`;

export const BtnGroup = styled.div`
  ${Basic}
  gap: 1.25rem;
`;

export const UserId = styled.div`
  ${Basic}
  font-size: 1rem;
  font-weight: 500;
  color: #4B4B4B;
  padding: 0.6rem 1rem;
  border-radius: 10rem;
  background-color: #f6f6f6;
`;