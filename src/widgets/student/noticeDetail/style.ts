import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 85vh;
    row-gap: 2.2rem;
`;

export const Title = styled.div`
    font-size: 1.8rem;
    font-weight: 500;
`;

export const Subtitle = styled.div`
    font-size: 1rem;
    color: #B2B2B2;
`;

export const TopContent = styled.div`
    font-size: 1.25rem;
    font-weight: 500;
`;

export const Group = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
`;

export const ImgGroup = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
`;

export const HeaderGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const DeleteBtn = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    background-color: #FF6B6B;
    color: #fff;
    border: none;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background-color: #FF5252;
    }
`;

export const FileWrapper = styled.div`
    position: relative;
    width: 30%;
    margin-bottom: 8px;
`;

export const DownloadBtn = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;

    &:hover {
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`;