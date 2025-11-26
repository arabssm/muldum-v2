'use client';

import styled from '@emotion/styled';
import { useState } from 'react';

interface GoogleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (calendarId: string) => void;
}

export default function GoogleCalendarModal({ isOpen, onClose, onSubmit }: GoogleCalendarModalProps) {
  const [calendarId, setCalendarId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!calendarId.trim()) {
      alert('캘린더 ID를 입력해주세요!');
      return;
    }
    onSubmit(calendarId.trim());
    setCalendarId('');
  };

  const handleOpenGoogleCalendar = () => {
    window.open('https://calendar.google.com/calendar/u/0/r', '_blank');
  };

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        <Title>구글 캘린더 연동</Title>
        
        <Description>
          구글 캘린더를 연동하려면<br />
          아래 단계를 따라주세요
        </Description>

        <WarningBox>
          <WarningIcon>⚠️</WarningIcon>
          <WarningText>
            <strong>중요:</strong> 캘린더를 서비스 계정에 공유해야 연동이 가능합니다
          </WarningText>
        </WarningBox>

        <InstructionBox>
          <InstructionTitle>📌 연동 방법</InstructionTitle>
          <InstructionList>
            <li>
              <StepLink onClick={handleOpenGoogleCalendar}>
                구글 캘린더 열기 →
              </StepLink>
            </li>
            <li>왼쪽에서 연동할 캘린더에 마우스 올리고 <strong>⋮</strong> → <strong>설정</strong> 클릭</li>
            <li>아래로 스크롤하여 <strong>"특정 사용자와 공유"</strong> 섹션 찾기</li>
            <li>
              다음 이메일 추가:
              <EmailBox>
                <EmailText>calender@muldum.iam.gserviceaccount.com</EmailText>
                <CopyButton onClick={() => {
                  navigator.clipboard.writeText('calender@muldum.iam.gserviceaccount.com');
                  alert('이메일이 복사되었습니다!');
                }}>
                  복사
                </CopyButton>
              </EmailBox>
            </li>
            <li>권한을 <strong>"변경 및 공유 관리"</strong>로 설정</li>
            <li>저장 후, <strong>"캘린더 통합"</strong> 탭에서 캘린더 ID 복사</li>
            <li>아래 입력창에 캘린더 ID 붙여넣기</li>
          </InstructionList>
        </InstructionBox>

        <Input
          type="text"
          placeholder="예: example@group.calendar.google.com"
          value={calendarId}
          onChange={(e) => setCalendarId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        <ButtonGroup>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit}>연동하기</SubmitButton>
        </ButtonGroup>
      </Container>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Container = styled.div`
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  color: #323232;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const WarningBox = styled.div`
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const WarningIcon = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`;

const WarningText = styled.p`
  font-size: 0.875rem;
  color: #e65100;
  margin: 0;
  line-height: 1.5;

  strong {
    font-weight: 600;
  }
`;

const InstructionBox = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
`;

const InstructionTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #323232;
  margin-bottom: 0.75rem;
`;

const InstructionList = styled.ol`
  font-size: 0.875rem;
  color: #666;
  padding-left: 1.25rem;
  line-height: 1.8;

  li {
    margin-bottom: 0.75rem;

    strong {
      color: #323232;
      font-weight: 600;
    }
  }
`;

const StepLink = styled.button`
  background: none;
  border: none;
  color: #ff9b62;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s;

  &:hover {
    color: #ff8640;
  }
`;

const EmailBox = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const EmailText = styled.code`
  font-size: 0.75rem;
  color: #323232;
  word-break: break-all;
  flex: 1;
`;

const CopyButton = styled.button`
  background-color: #ff9b62;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff8640;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ff9b62;
  }

  &::placeholder {
    color: #999;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const CancelButton = styled(BaseButton)`
  background-color: #f5f5f5;
  color: #666;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const SubmitButton = styled(BaseButton)`
  background-color: #ff9b62;
  color: #fff;

  &:hover {
    background-color: #ff8640;
  }
`;
