import styled from "@emotion/styled";
import type { BtnProps } from "@/types";

export function BtnPrimary({ children, onClick }: BtnProps) {
    return (
        <Container>
            <ButtonPrimary onClick={onClick}>{children}</ButtonPrimary>
        </Container>
    );
}

export function BtnSecondary({ children, onClick }: BtnProps) {
    return (
        <Container>
            <ButtonSecondary onClick={onClick}>{children}</ButtonSecondary>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
`;

const ButtonPrimary = styled.button`
    display: flex;
    padding: 0.75rem 1rem;
    border: none;
    background-color: #FF9B62;
    color: #fff;
    border-radius: 4px;
    font-size: 1.175rem;
    font-weight: 500;
    cursor: pointer;
`;

const ButtonSecondary = styled.button`
    display: flex;
    padding: 0.75rem 1rem;
    border: 1px solid #FF9B62;
    color: #FF9B62;
    background-color: transparent;
    border-radius: 4px;
    font-size: 1.175rem;
    font-weight: 500;
    cursor: pointer;
`;