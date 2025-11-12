import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
    gap: 2.5rem;
`;

export const BtnWrapper = styled.div`
    display: flex;
    gap: 1.2rem;
`;

export const Group = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;  

export const Title = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
`;

export const SubTitle = styled.div`
    font-size: 1rem;
    color: #B2B2B2;
`;

export const Btn = styled.button`
    display: flex;
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border: 1px solid #B2B2B2;
    background-color: transparent;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #FFF5EF;
        border: 1px solid #FF9B62;
    }

    &:active {
        background-color: #FFF5EF;
        border: 1px solid #FF9B62;
    }
`;


export const Select = styled.select`
  padding: 0.5rem 1.8rem 0.5rem 0.8rem;
  border: 1px solid #D1D1D1;
  border-radius: 4px;
  background-color: white;
  font-size: 0.95rem;
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const BtnGroup = styled.div`
    display: flex;
    justify-content: end;
    gap: 1.25rem;
`;

export const Gray = styled.div`
    color: #B2B2B2;
    margin-left: 0.5rem;
`;