import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70vh;

`;

export const CalendarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

export const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    flex-shrink: 0;
    background-color: #fafafa;
    border: 1px solid #E7E8EA;
    height: 8%;
`;

export const HeaderCell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 1rem;
    border-right: 1px solid #e5e7eb;
`;

export const Body = styled.div`
    display: grid;
    flex: 1;
    grid-template-columns: repeat(7, 1fr);
`;

export const Cell = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1rem;
    font-size: 0.95rem;
    border-right: 1px solid #E7E8EA;
    border-bottom: 1px solid #E7E8EA;
`;