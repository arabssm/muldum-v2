import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 3.5rem;
  margin: 0 auto;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BtnGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
`;

export const Input = styled.input<{ inputWidth?: string; isError?: boolean }>`
  font-size: 1rem;
  border: 1px solid ${({ isError }) => (isError ? "#DF3636" : "#D1D1D1")};
  border-radius: 4px;
  padding: 0.75rem;
  width: ${({ inputWidth }) => inputWidth || "100%"};
  box-sizing: border-box;
  line-height: 1rem;
  
  ::placeholder {
    color: #D1D1D1;
  }

  &:focus {
    outline: none;
  }
`;

export const Textarea = styled.textarea<{ isError?: boolean }>`
  display: flex;
  padding: 0.75rem;
  height: 20vh;
  font-size: 1rem;
  border: 1px solid ${({ isError }) => (isError ? "#DF3636" : "#D1D1D1")};
  border-radius: 4px;
  resize: none;
    
  ::placeholder {
    color: #D1D1D1;
  }

  &:focus {
    outline: none;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

export const TeamSelector = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
`;

export const TeamText = styled.div<{ isActive: boolean }>`
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

export const ReportsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

export const ReportCard = styled.div`
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const ReportTopic = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

export const ReportStatus = styled.span<{ color: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background-color: ${(props) => props.color}20;
  color: ${(props) => props.color};
  font-size: 0.85rem;
  font-weight: 500;
`;

export const ReportDate = styled.p`
  font-size: 0.85rem;
  color: #666;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1rem;
`;
