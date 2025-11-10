import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";

export default function Feedback() {
    const router = useRouter();

    return (
        <Container>
            <Wrapper>
                <Title>피드백을 자유롭게 작성해주세요</Title>
                <Input placeholder="피드백 내용을 작성해주세요." />
            </Wrapper>
            <BtnGroup>
                <BtnSecondary onClick={() => router.push('/monthCheck')}>취소</BtnSecondary>
                <BtnPrimary onClick={() => router.push('/monthCheck')}>반려</BtnPrimary>
            </BtnGroup>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem 0;
    gap: 3rem;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`;

const BtnGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 1rem;
`;

const Title = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
`;

const Input = styled.textarea`
    width: 100%;
    height: 30vh;
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