import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 85vh;
`;

export const Group = styled.div`
    display: flex;
    gap: 2.5rem;
    width: 80%;
    flex-direction: column;
    align-items: center;
`;

export const Wrapper = styled.div`
    display: flex;
    align-items: center;
    align-items: flex-start;
    gap: 2rem;
    width: 100%;
`;

export const BtnGroup = styled.div`
    width: 100%;
    justify-content: end;
    display: flex;
    gap: 1rem;
`

export const Title = styled.div`
    width: 100%;
    font-size: 1.5rem;
    font-weight: 500;
`;

export const SubTitle = styled.div`
    font-size: 1.4rem;
    font-weight: 500;
    min-width: 8%;
    display: flex;
    align-items: center;
`;

export const Input = styled.input`
    width: 60%;
    padding: 0.8rem;
    border: 1px solid #D1D1D1;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;

    ::placeholder {
        color: #D1D1D1;
    }
`;

export const DateInput = styled.input`
    padding: 0.6rem 0.8rem;
    border: 1px solid #D1D1D1;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
`;

export const TextArea = styled.textarea`
    width: 100%;
    height: 25vh;
    padding: 1rem;
    border: 1px solid #D1D1D1;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
    resize: none;

    ::placeholder {
        color: #D1D1D1;
    }
`;

export const FileDrop = styled.div`
    width: 100%;
    min-height: 15vh;
    border: 1px solid #D1D1D1;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #D1D1D1;
`;