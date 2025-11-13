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
  position: relative;
`;

export const CoverContainer = styled.div`
  position: relative;
`;

export const Cover = styled.div`
  width: 100%;
  height: 20vh;
  background: #fafafa;
  overflow: hidden;
  position: relative;

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

export const IconWrapper = styled.div`
  position: absolute;
  bottom: -2.5rem;
  left: 3rem;
  display: flex;
  align-items: center;
  z-index: 2;
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
  top: -6px;
  right: -6px;
  background: #fff;
  border: 1px solid #ccc;
  color: #888;
  border-radius: 99px;
  width: 1.25rem;
  height: 1.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #f5f5f5;
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
  background: transparent;
  transition: 0.2s;

  &:hover {
    background: #f4f4f4;
  }
`;

export const EmojiPickerWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: 6rem;
  left: 0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ImageLabel = styled.label`
  display: inline-block;
  font-size: 0.9rem;
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

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4rem 3rem 2rem 3rem;
`;

export const Title = styled.input`
  font-size: 1.7rem;
  font-weight: 700;
  outline: none;
  border: none;
  background: transparent;
  margin-top: 0.65rem;
  cursor: text;

  &::placeholder {
    color: #bbb;
  }
`;

export const EditorWrapper = styled.div`
  .bn-container {
    border-radius: 4px;
  }
`;