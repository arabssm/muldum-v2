import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: flex-start;
    white-space: normal;
    row-gap: 2rem;
`;

export const Item = styled.div`
    display: flex;
    flex: 0 0 31.8%;
    padding: 3rem;
    border-radius: 1rem;
    justify-content: center;
    flex-direction: column;
    row-gap: 0.8rem;
    background-color: #FAFAFA;
    cursor: pointer;

    &:hover{
        background-color: #F1F1F1;
    }
`;

export const PointGroup = styled.div`
    display: flex;
    gap: 1rem;
`;

export const Title = styled.div`
    font-size: 1.75rem;
    font-weight: 600;
`;

export const Point = styled.div`
    display: flex;
    align-items: center;
    font-size: 1.075rem;
    color: #FF9B62;
    gap: 0.4rem;
`;

export const Content = styled.div`
    display: flex;
    font-size: 1.075rem;
    color: #B2B2B2;
`;