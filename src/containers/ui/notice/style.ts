import styled from "@emotion/styled";
import type { Badgeprops } from "@/types";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 85vh;
    row-gap: 2rem;
`;

export const NoticeGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    padding: 0.6rem;
    cursor: pointer;

    &:hover{
        background-color: #FAFAFA;
        border-radius: 4px;
    }
`;

export const Title = styled.div`
    font-size: 1.5rem;
    font-weight: 500;
`;

export const Badge = styled.div<Badgeprops>`
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  border-radius: 10rem;
  color: #fff;
  background-color: ${({ bgColor }) => bgColor};
`;

export const Group = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  background-color: #FAFAFA;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  gap: 0.5rem;
  background-color: #FAFAFA;
  width: fit-content;

  input {
    background-color: #FAFAFA;
    border: none;
    outline: none;
    font-size: 0.9rem;
    width: 20rem;
  }

  ::placeholder {
    color: #D1D1D1;
  }

  &:focus {
    outline: none;
  }
`;

export const NoticeContainer = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 0.3rem;
`;

export const Notice = styled.div`
    font-size: 1.25rem;
`;

export const Date = styled.div`
    font-size: 1rem;
    color: #B2B2B2;
`;

export const NoticeWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`;