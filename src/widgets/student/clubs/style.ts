import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-between;
    white-space: normal;
    row-gap: 2rem;
`;

export const Item = styled.div`
    display: flex;
    flex: 0 0 31%;
    padding: 3rem;
    border-radius: 1rem;
    justify-content: center;
    flex-direction: column;
    row-gap: 0.8rem;
    background-color: #FAFAFA;
    cursor: auto;

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

export const SelectWrapper = styled.div`
    width: 100%;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: flex-end;
`;

export const Select = styled.select`
    padding: 0.75rem 3.5rem 0.75rem 1rem;
    font-size: 1.125rem;
    border: 1px solid #E0E0E0;
    border-radius: 0.5rem;
    background-color: white;
    cursor: pointer;
    outline: none;
    min-width: 120px;
    
    &:hover {
        border-color: #FF9B62;
    }
    
    &:focus {
        border-color: #FF9B62;
    }
`;

export const LogoWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 1rem 0;
`;