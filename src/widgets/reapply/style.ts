import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 3rem;
    width: 100%;
    padding: 1rem 0;
    margin: 0 auto;
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

export const Box = styled.div<{ bgImage: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 15%;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  padding: 1rem;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0,0,0,0.5)), url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  color: #FAFAFA;
  box-sizing: border-box;
`;

export const TextGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
`;

export const Text = styled.div`
    font-size: 1.25rem;
    font-weight: 500;
    color: #fafafa;
`;

export const Small = styled.div`
    font-size: 0.875;
    color: #909090;
`;

export const Group = styled.div`
    display: flex;
    gap: 1rem
`;