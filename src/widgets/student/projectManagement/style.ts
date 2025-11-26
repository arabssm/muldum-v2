import styled from '@emotion/styled';
import { TaskStatus } from '@/shared/api/tasks';

export const Container = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #FAFAFA;
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #4B4B4B;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ViewToggle = styled.div`
  display: flex;
  background-color: white;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const ViewButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  background-color: ${({ isActive }) => (isActive ? '#FF9B62' : 'transparent')};
  color: ${({ isActive }) => (isActive ? 'white' : '#909090')};
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ isActive }) => (isActive ? 'white' : '#4B4B4B')};
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #FF9B62;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FF8A4D;
  }
`;

export const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  min-height: 500px;
  transition: background-color 0.2s;
`;

export const ColumnHeader = styled.div<{ status: TaskStatus }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  background-color: ${({ status }) =>
    status === 'TODO' ? '#FAFAFA' : status === 'IN_PROGRESS' ? '#FFF5F5' : '#FFF0E8'};
  border-left: 3px solid ${({ status }) =>
    status === 'TODO' ? '#E5E5E5' : status === 'IN_PROGRESS' ? '#FFD6D6' : '#FF9B62'};
`;

export const ColumnTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #4B4B4B;
`;

export const TaskCount = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #909090;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
`;

export const TaskCard = styled.div<{ isDragging?: boolean }>`
  background-color: #FAFAFA;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  padding: 16px;
  cursor: grab;
  transition: all 0.2s;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  transform: ${({ isDragging }) => (isDragging ? 'rotate(2deg)' : 'none')};

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    background-color: white;
  }

  &:active {
    cursor: grabbing;
  }
`;

export const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const CategoryBadge = styled.span<{ color: string }>`
  padding: 4px 12px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  padding: 4px 8px;
  background-color: transparent;
  color: #909090;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: white;
    color: #4B4B4B;
    border-color: #4B4B4B;
  }
`;

export const TaskTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #4B4B4B;
  margin-bottom: 12px;
  word-break: break-word;
`;

export const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

export const InfoItem = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
`;

export const InfoLabel = styled.span`
  color: #909090;
  font-weight: 500;
`;

export const InfoValue = styled.span`
  color: #4B4B4B;
`;

export const StatusButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export const StatusButton = styled.button`
  flex: 1;
  padding: 8px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1976D2;
  }
`;

// Modal styles
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
  border-radius: 4px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #4B4B4B;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: #909090;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4B4B4B;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4B4B4B;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  color: #4B4B4B;

  &:focus {
    outline: none;
    border-color: #FF9B62;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
  color: #4B4B4B;

  &:focus {
    outline: none;
    border-color: #FF9B62;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

export const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #FAFAFA;
  color: #909090;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: white;
    color: #4B4B4B;
    border-color: #4B4B4B;
  }
`;

export const SubmitButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: #FF9B62;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FF8A4D;
  }
`;
