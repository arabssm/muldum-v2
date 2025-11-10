import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 70vh;
`;

export const TopContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3.5rem;
  cursor: pointer;
`;

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 70vh;
  background: #FAFAFA;
  border-radius: 4px;
  position: relative;
`;

export const ResizeHandle = styled.div`
  cursor: ew-resize;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  background: transparent;
  z-index: 10;
`;

export const ChatScroll = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1.5rem;
  gap: 1.5rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ChatMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const Chat = styled.div`
  font-size: 1rem;
  font-weight: 400;
`;

export const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.1rem;
  font-weight: 600;
`;

export const ChatInput = styled.input`
  width: 100%;
  border: none;
  padding: 1rem;
  border-top: 1px solid #eee;
  background-color: #fafafa;
  border-radius: 0 0 4px 4px;
  font-size: 1rem;
  outline: none;
`;

export const Circle = styled.div`
  width: 2rem;
  height: 2rem;
  background: #8fd694;
  border-radius: 50%;
`;

export const VideoArea = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const ParticipantPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 70vh;
  width: 18rem;
  background: #fafafa;
  border-radius: 4px;
  padding: 1rem;
`;

export const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
`;

export const CloseButton = styled.button`
  align-self: flex-end;
  font-weight: 400;
  border: none;
  background: none;
  font-size: 1.25rem;
  cursor: pointer;
`;

export const Drag = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  height: 100%;
  cursor: ew-resize;
`;


export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  padding: 0 0.5rem;
  background-color: #fafafa;
  border-radius: 0 0 4px 4px;
`;

export const IconWrapper = styled.div`
    display: flex;
    gap: 3.5rem;
`;

export const IconGroup = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  gap: 0.4rem;
`;

export const Sub = styled.button`
  display: flex;
  color: #909090;
  background-color: transparent;
  border: none;
  font-size: 1.15rem;
  cursor: pointer;
`;