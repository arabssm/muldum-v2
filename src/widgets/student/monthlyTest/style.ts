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