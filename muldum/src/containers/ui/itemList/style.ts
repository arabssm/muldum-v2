import styled from "@emotion/styled";

export const Containet = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
  row-gap: 2rem;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
`;

export const Title = styled.div`
  display: flex;
  font-size: 1.5rem;
  font-weight: 500;
`;

export const State = styled.span<{ color: string }>`
  display: flex;
  font-size: 1.075rem;
  color: ${({ color }) => color};
`;

export const ToggleImage = styled.div<{ isOpen: boolean }>`
  display: flex;
  transition: transform 0.3s ease;
  transform: rotate(${props => (props.isOpen ? "90deg" : "0deg")});
`;

export const Content = styled.div`
  display: block;
  font-size: 1rem;
  line-height: 1.4;
`;
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.6rem;
  padding-left: 0;
  
  & > div {
    display: flex;
    gap: 5rem;
  }

  & > div::before {
    content: "";
    display: inline-block;
    width: 1.2rem;
    flex-shrink: 0;
  }
`;