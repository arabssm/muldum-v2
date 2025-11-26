import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Page = styled.div`
  width: 100%;
  min-height: 70vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const CoverContainer = styled.div`
  position: relative;
`;

export const Cover = styled.div`
  width: 100%;
  height: 20vh;
  background: #fafafa;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CoverPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  label {
    cursor: pointer;
    font-size: 0.9rem;
    border: 1px solid #ddd;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    background-color: #fff;
    transition: 0.2s;
  }

  label:hover {
    background-color: #f5f5f5;
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  bottom: -2.5rem;
  left: 3rem;
  display: flex;
  align-items: center;
  z-index: 2;
`;

export const IconImageWrapper = styled.div`
  position: relative;
  display: flex;
`;

export const IconImage = styled.img`
  width: 5rem;
  height: 5rem;
  font-size: 3.25rem;
  border-radius: 4px;
  cursor: pointer;
  object-fit: cover;
`;

export const ResetButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #fff;
  border: 1px solid #ccc;
  color: #888;
  border-radius: 99px;
  width: 1.25rem;
  height: 1.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

export const EmojiWrapper = styled.div`
  position: relative;
  display: flex;
`;

export const IconDisplay = styled.div`
  width: 5rem;
  height: 5rem;
  font-size: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  background: transparent;
  transition: 0.2s;

  &:hover {
    background: #f4f4f4;
  }
`;

export const EmojiPickerWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: 6rem;
  left: 0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ImageLabel = styled.label`
  display: inline-block;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fafafa;
  margin: 0.6rem;
  text-align: center;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    background: #f2f2f2;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 3rem 1.5rem 3rem;
`;

export const Title = styled.input`
  font-size: 1.7rem;
  font-weight: 700;
  outline: none;
  border: none;
  background: transparent;
  margin-top: 0.65rem;
  cursor: text;

  &::placeholder {
    color: #bbb;
  }
`;

export const EditorWrapper = styled.div`
  .bn-container {
    border-radius: 4px;
  }
`;
exp
ort const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }

  &::placeholder {
    color: #999;
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: ${props => props.active ? '#4a90e2' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  border-bottom: 2px solid ${props => props.active ? '#4a90e2' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #4a90e2;
  }
`;

export const InfoText = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

export const PasteArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
    border-style: solid;
  }

  &::placeholder {
    color: #999;
  }
`;
