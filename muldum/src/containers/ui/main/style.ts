import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { Badgeprops } from "@/types/main";

const flex = css`
    display: flex;
`;

const centerAlign = css`
    ${flex}
    align-items: center;
`;

export const Container = styled.div`
    ${flex}
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem 3rem;
    row-gap: 2rem;
`;

export const Info = styled.div`
    ${flex}
    justify-content: space-between;
`;

export const Wrapper = styled.div`
    ${flex}
    flex-direction: column;
    row-gap: 1rem;
    width: 48%;
`;

export const Menu = styled.button`
    ${flex}
    justify-content: center;
    flex-direction: column;
    text-align: left;
    width: 100%;
    padding: 1.5rem;
    row-gap: 0.4rem;
    border-radius: 0.5rem;
    background-color: #FAFAFA;
    border: none;
    cursor: pointer;

    &:hover{
        background-color: #F0F0F0;
    }
`;

export const Title = styled.div`
    font-size: 1.5rem;
    font-weight: 500;
`;

export const Subtitle = styled.div`
    font-size: 1rem;
    color: #707070;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        color: #3F3F3F;
    }
`;

export const Group = styled.div`
    ${flex}
    justify-content: space-between;
    align-items: center;
`;

export const Badge = styled.div<Badgeprops>`
  ${centerAlign}
  padding: 0.6rem 1.2rem;
  border-radius: 10rem;
  color: #fff;
  background-color: ${({ bgColor }) => bgColor};
`;

export const Notice = styled.div`
    font-size: 1.25rem;
`;

export const NoticeGroup = styled.div`
    ${centerAlign}
    gap: 0.8rem;
    padding: 0.6rem;
    cursor: pointer;

    &:hover{
        background-color: #FAFAFA;
        border-radius: 4px;
    }
`;