import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 3.5rem;
    width: 100%;
    margin: 0 auto;
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