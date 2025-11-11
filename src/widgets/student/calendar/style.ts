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

  /* FullCalendar 커스텀 스타일 */
  .fc {
    background: white;
    font-family: inherit;
    height: 100%;
  }

  .fc-toolbar {
    background: white !important;
    padding: 1rem 1rem 0.5rem 1rem;
    border-bottom: none !important;
    margin-bottom: 0 !important;
  }

  .fc-toolbar-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }

  .fc-button {
    background: white !important;
    color: #666 !important;
    border: 1px solid #ddd !important;
    border-radius: 6px !important;
    padding: 0.4rem 0.8rem !important;
    font-size: 0.9rem !important;
    
    &:hover {
      background: #f8f8f8 !important;
      border-color: #ccc !important;
    }
    
    &:disabled {
      opacity: 0.4;
    }
  }

  .fc-button-primary:not(:disabled):active,
  .fc-button-primary:not(:disabled).fc-button-active {
    background: white !important;
    color: #666 !important;
  }

  /* 요일 헤더 */
  .fc-col-header-cell {
    background: white !important;
    border-color: #e5e5e5 !important;
    padding: 1rem 0;
    font-weight: 500;
    color: #666;
    font-size: 0.9rem;
  }

  /* 날짜 셀 */
  .fc-daygrid-day {
    border-color: #e5e5e5 !important;
    cursor: pointer;
    min-height: 120px;
    
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
    color: #333;
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

  .fc-daygrid-event-harness {
    margin-top: 2px;
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