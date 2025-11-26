import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 3.5rem;
    width: 100%;
    margin: 0 auto;
    position: relative;
`;

export const BudgetInfo = styled.div`
    position: fixed;
    top: 6rem;
    right: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background-color: transparent;
    font-size: 0.95rem;
    font-weight: 500;
    color: #495057;
    z-index: 100;
    
    span {
        color: #ff9b62;
        font-weight: 600;
        font-size: 1.1rem;
    }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 0.85rem;
    width: auto;
`;

export const Title = styled.div`
    display: flex;
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

export const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 2rem;
  width: 100%;
  height: 60vh; 
`;

export const Message = styled.div`
  font-size: 2rem;
  font-weight: 500;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  display: flex;
  font-size: 0.875rem;
  gap: 0.25rem;
  color: #DF3636;
`;

export const GuideModalInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

export const GuideTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

export const GuideEditorWrapper = styled.div`
  width: 100%;
  min-height: 200px;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
  flex: 1;
  
  /* 에디터 내부 요소가 밖으로 튀어나가지 않도록 */
  & > * {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
  
  /* BlockNote 에디터 스타일 조정 */
  .bn-container {
    max-width: 100%;
  }
`;

export const GuideButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const GuideCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  label {
    cursor: pointer;
    font-size: 0.9rem;
    color: #666;
  }
`;

export const GuideCloseButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background-color: #ff9b62;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff8a4d;
  }

  &:active {
    background-color: #ff7938;
  }
`;
