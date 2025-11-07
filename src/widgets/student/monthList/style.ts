import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;

export const MonthBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Month = styled.div`
    color: #B2B2B2;;
`;

export const MonthHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const Content = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-height: ${(props) => (props.isOpen ? 'auto' : '0')};
  overflow: hidden;
  transition: max-height 0.36s ease, opacity 0.24s ease, padding 0.24s ease;
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  padding-top: ${(props) => (props.isOpen ? '1rem' : '0')};
`;