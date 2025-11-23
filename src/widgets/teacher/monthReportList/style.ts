import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
  padding: 1rem;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TeamItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${(props) => (props.isSelected ? '#1976d2' : '#e0e0e0')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.isSelected ? '#e3f2fd' : '#fff')};

  &:hover {
    border-color: #1976d2;
    background-color: #f5f5f5;
  }
`;

export const TeamName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

export const TeamMembers = styled.div`
  font-size: 0.9rem;
  color: #666;
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
