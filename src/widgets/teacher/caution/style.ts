import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 85vh;
`;

export const BtnGroup = styled.div`
    width: 100%;
    justify-content: end;
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

export const Group = styled.div`
    display: flex;
    gap: 4rem;
    width: 80%;
    flex-direction: column;
    align-items: center;
`;

export const Wrapper = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    width: 100%;
`;

export const Title = styled.div`
    width: 100%;
    font-size: 1.5rem;
    font-weight: 500;
`;

export const SubTitle = styled.div`
    font-size: 1.4rem;
    font-weight: 500;
    min-width: 8%;
    display: flex;
    align-items: center;
`;

export const detail = styled.div`
    width: 100%;
    flex: 1;
    padding: 1rem 0;
    min-height: 15vh;
    border: 1px solid #D1D1D1;
    border-radius: 4px;
    display: flex;
    color: #D1D1D1;
`;