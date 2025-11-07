import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70vh;
`;

export const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex-shrink: 0;
  background-color: #FAFAFA;
  border: 1px solid #E7E8EA;
  height: 8%;
`;

export const HeaderCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
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
  border: 1px solid #E7E8EA;
`;

export const CellHighlighted = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
  font-size: 0.95rem;
  border: 1px solid #E7E8EA;
  background: ${({ isHighlighted }) => (isHighlighted ? 'rgba(255,155,98,0.12)' : 'white')};
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
  border: 1px solid #E7E8EA;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  color: #333;

  ::placeholder {
    color: #B2B2B2;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const SmallText = styled.div`
  color: #B2B2B2;
  font-size: 0.9rem;
`;

export const SaveBtn = styled.button`
  padding: 0.6rem 1.25rem;
  background: #FF9B62;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #ff8640;
  }
`;