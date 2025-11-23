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
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e5e5;

  .fc {
    background: white;
    height: 100%;
  }

  .fc-toolbar {
    padding: 1rem;
    margin-bottom: 0 !important;
  }

  .fc-toolbar-title {
    font-size: 1.25rem;
    font-weight: 500;
  }

  .fc-button {
    display: flex;
    background: white !important;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    padding: 0.4rem 0.6rem !important;
    font-size: 0.8rem !important;

    &:hover {
      border: 1px solid #ff9b62 !important;
    }
    
    &:focus {
      background: white !important;
      border-color: #ff9b62 !important;
      box-shadow: none !important;
      outline: none !important;
    }
    
    &:disabled {
      opacity: 0.4;
    }
  }

  /* 요일 헤더 */
  .fc-col-header-cell {
    background: white !important;

    padding: 1rem 0;
    font-weight: 500;
    font-size: 0.9rem;
  }

  /* 날짜 셀 */
  .fc-daygrid-day {
    cursor: pointer;
    
    &:hover {
      background: #fafafa;
    }
  }

  .fc-daygrid-day-frame {
    min-height: 120px;
  }

  .fc-daygrid-day-number {
    padding: 0.6rem;
    font-size: 0.95rem;
    font-weight: 500;
  }

  /* 오늘 날짜 스타일 */
  .fc-day-today {
    background: white !important;
  }

  /* 이벤트 스타일 */
  .fc-event {
    border: none !important;
    border-radius: 6px !important;
    padding: 4px 8px !important;
    font-size: 0.85rem !important;
    margin: 2px 4px !important;
    cursor: pointer;
    
    &:hover {
      opacity: 0.9;
    }
  }

  /* 선택 영역 스타일 */
  .fc-highlight {
    background: rgba(255, 155, 98, 0.15) !important;
  }

  /* 스크롤바 스타일 */
  .fc-scroller {
    overflow-y: auto !important;
  }
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex-shrink: 0;
  background-color: #fafafa;
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

export const DetailContent = styled.div`
  width: 100%;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  min-height: 80px;
  white-space: pre-wrap;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;
`;

export const EditBtn = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #45a049;
  }
`;

export const DeleteBtn = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #da190b;
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