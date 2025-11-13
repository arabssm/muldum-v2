import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Page = styled.div`
  width: 100%;
  min-height: 70vh;
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
  margin-top: 0.65rem;
  cursor: text;
`;

export const EditorWrapper = styled.div`
  .bn-container {
    border-radius: 4px;
  }
`;

export const IconWrapper = styled.div`
    position: relative;
    display: flex;
`;

export const IconImageWrapper = styled.div`
    position: relative;
    display: flex;
`;

export const IconImage = styled.img`
    width: 5rem;
    height: 5rem;
    font-size: 3.25rem;
    border-radius: 4px;
    cursor: pointer;
    object-fit: cover;
`;

export const ResetButton = styled.button`
    position: absolute;
    background: transparent;
    border: 1px solid #ccc;
    color: #ccc;
    border-radius: 99px;
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.8rem;
    cursor: pointer;

    &:hover {
        background: #f2f2f2;
    }
`;

export const EmojiWrapper = styled.div`
    position: relative;
    display: flex;
`;

export const IconDisplay = styled.div`
    width: 5rem;
    height: 5rem;
    font-size: 3.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    transition: 0.2s;
    &:hover {
        background: #f4f4f4;
    }
`;

export const EmojiPickerWrapper = styled.div`
    position: absolute;
    z-index: 1;
    background: transparent;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ImageLabel = styled.label`
    display: inline-block;
    font-size: 0.95rem;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background: #fafafa;
    margin: 0.6rem;
    text-align: center;
    transition: 0.2s;
    cursor: pointer;
    
    &:hover {
        background: #f2f2f2;
    }
`;