import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  padding: 1rem;
`;

export const TabGroup = styled.div`
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.5rem;
  flex: 1;
`;

export const TabButton = styled.div<{ isActive: boolean }>`
  display: flex;
  padding: 0.75rem;
  font-size: 1.125rem;
  font-weight: ${({ isActive }) => (isActive ? 500 : 400)};
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? "#4B4B4B" : "#B2B2B2")};
  border-bottom: 2.5px solid ${({ isActive }) => (isActive ? "#4B4B4B" : "#B2B2B2")};

  &:hover {
    background-color: ${({ isActive }) =>
      isActive ? "transparent" : "#f5f5f5b6"};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  width: 100%;
  gap: 1rem;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

export const MonthSelector = styled.div`
  select {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #1976d2;
    }
  }
`;

export const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    border-color: #1976d2;
  }
`;

export const ReportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ReportTopic = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

export const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${(props) => 
    props.status === 'SUBMIT' ? '#e3f2fd' : 
    props.status === 'DRAFT' ? '#fff3e0' : '#f5f5f5'};
  color: ${(props) => 
    props.status === 'SUBMIT' ? '#1976d2' : 
    props.status === 'DRAFT' ? '#f57c00' : '#666'};
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1rem;
`;

export const DeleteText = styled.div`
  font-size: 0.95rem;
  color: #909090;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #4B4B4B;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #4B4B4B;
  margin: 0;
`;

export const DeleteMessage = styled.p`
  font-size: 1rem;
  color: #4B4B4B;
  margin: 0;
  line-height: 1.5;
`;

export const DeleteButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #E0E0E0;
  color: #4B4B4B;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #D0D0D0;
  }
`;

export const ConfirmDeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #FF4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #CC0000;
  }
`;
