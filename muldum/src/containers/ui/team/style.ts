import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: 5rem;
    margin: 0 auto;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const Text = styled.div`
    display: flex;
    font-size: 1.5rem;
    font-weight: 600;
`;

export const Group = styled.div`
    display: flex;
    gap: 1.25rem;
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.5rem;
`;

export const Box = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 25%;
    padding: 2rem 1.8rem;
    flex: 0 0 auto;
    background-color: #FAFAFA;
    border-radius: 4px;
`;

export const Name = styled.div`
    display: flex;
    font-size: 1.25rem;
    font-weight: 500;
`;

export const Member = styled.div`
    display: flex;
    font-size: 1rem;
    color: #909090;
`;