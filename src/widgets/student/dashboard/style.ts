import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #FAFAFA;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #4B4B4B;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #909090;
`;

// 통계 카드
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div<{ color: string }>`
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #4B4B4B;
  margin-bottom: 8px;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #909090;
`;

// 차트
export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

export const ChartCard = styled.div`
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #4B4B4B;
  margin-bottom: 16px;
`;

export const ChartWrapper = styled.div`
  height: 250px;
  position: relative;
`;

// 알림 섹션
export const AlertsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

export const AlertCard = styled.div<{ type: 'error' | 'warning' }>`
  background-color: white;
  border-radius: 4px;
  padding: 20px;
  border-left: 3px solid #FF9B62;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const AlertTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #4B4B4B;
  margin-bottom: 16px;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskItem = styled.div`
  background-color: #FAFAFA;
  border-radius: 4px;
  padding: 12px;
`;

export const TaskItemTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #4B4B4B;
  margin-bottom: 8px;
`;

export const TaskItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909090;
  
  span {
    &:first-of-type {
      color: #FF9B62;
      font-weight: 500;
    }
  }
`;
