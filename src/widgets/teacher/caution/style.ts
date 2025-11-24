import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  height: 100%;
  padding: 2rem;
`;

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  border: none;
  outline: none;
`;

export const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Select = styled.select`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #ff9b62;
  }
`;

export const EditorWrapper = styled.div`
  width: 100%;
  min-height: 500px;
`;
