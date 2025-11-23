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
    align-items: flex-start;
    gap: 2rem;
    width: 100%;
`;

export const BtnGroup = styled.div`
    width: 100%;
    justify-content: end;
    display: flex;
    gap: 1rem;
`;

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

export const detail = styled.div`
    width: 100%;
    flex: 1;
    padding: 1rem 0;
    min-height: 15vh;
    border: 1px solid #D1D1D1;
    border-radius: 4px;
    display: flex;
    color: #D1D1D1;
`;

export const FileList = styled.div`
    display: flex;
    gap: 0.8rem;
    width: 100%;
`;

export const FileItem = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    padding: 1.2rem;
    border-radius: 4px;
`;

export const ThumbnailWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 8rem;
    height: 8rem;
`;

export const Thumbnail = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
`;

export const FileName = styled.div`
    font-size: 0.8rem
`;

export const RemoveBtn = styled.button`
    position: absolute;
    top: -6px;
    right: -6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: rgba(0,0,0,0.6);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
`;