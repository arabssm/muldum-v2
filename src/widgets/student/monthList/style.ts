import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;

export const MonthTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

export const MonthBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Month = styled.div`
  color: #333;
  font-weight: 500;
  flex: 1;
`;

export const MonthHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  gap: 0.5rem;

  &:hover {
    opacity: 0.8;
  }
`;

export const Content = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-height: ${(props) => (props.isOpen ? 'auto' : '0')};
  overflow: hidden;
  transition: max-height 0.36s ease, opacity 0.24s ease, padding 0.24s ease;
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  padding-top: ${(props) => (props.isOpen ? '1rem' : '0')};
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