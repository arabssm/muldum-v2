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
  cursor: pointer;
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex-shrink: 0;
  background-color: #fafafa;
  border: 1px solid #e7e8ea;
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
  grid-template-rows: repeat(5, 1fr);
  position: relative;
`;

export const CellHighlighted = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
  font-size: 0.95rem;
  border: 1px solid #e7e8ea;
  background: ${({ isHighlighted }) =>
    isHighlighted ? "rgba(255,155,98,0.12)" : "white"};
  position: relative;
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
  border: 1px solid #e7e8ea;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;
  color: #333;

  ::placeholder {
    color: #b2b2b2;
  }
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const SmallText = styled.div`
  color: #b2b2b2;
  font-size: 0.9rem;
`;

export const SaveBtn = styled.button`
  padding: 0.6rem 1.25rem;
  background: #ff9b62;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #ff8640;
  }
`;

export const EventBarAbsolute = styled.div<{
  color: string;
  left: string;
  top: string;
  width: string;
}>`
  position: absolute;
  height: 1.6rem;
  background: ${({ color }) => color};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 3rem;
  padding-left: 0.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  width: ${({ width }) => width};
  transition: all 0.2s ease-in-out;
  z-index: 2;
`;