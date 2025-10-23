import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

export const Cover = styled.div`
  width: 100%;
  height: 15vh;
  background: #fafafa;
  overflow: hidden;

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

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 3rem;
`;

export const IconInput = styled.div`
  font-size: 3rem;
  margin-top: -3rem;
  margin-bottom: 0.5rem;
  outline: none;
  cursor: text;
`;

export const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  outline: none;
  cursor: text;
`;

export const ContentArea = styled.div`
  padding: 0rem 3rem;
  outline: none;
  min-height: 60vh;
`;