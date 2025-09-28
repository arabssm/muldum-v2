import styled from "@emotion/styled";

export const Group = styled.div`
  display: flex;
  gap: 4rem;
  width: 100%;
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

export const Number = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  border: 1px solid #D1D1D1;
  border-radius: 4px;
  padding: 0.75rem;
  box-sizing: border-box;
  gap: 1rem;
  height: 2.8rem;
  cursor: pointer;
`;

export const Num = styled.div`
  font-size: 1rem;
`;

export const Icons = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BtnGroup = styled.div`
  display: flex;
  justify-content: end;
  gap: 1.25rem;
`;

export const ErrorMessage = styled.div`
  display: flex;
  font-size: 0.875rem;
  gap: 0.25rem;
  color: #DF3636;
`;
