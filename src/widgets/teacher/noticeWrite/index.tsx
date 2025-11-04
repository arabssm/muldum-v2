import * as _ from "./style";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";

export default function noticeWrite() {
    return (
        <_.Container>
            <_.Group>
                <_.Title>공지사항 작성</_.Title>
                <_.Wrapper>
                    <_.SubTitle>제목</_.SubTitle>
                    <_.Input type="text" placeholder="공지사항 제목을 입력해주세요." />
                </_.Wrapper>
                <_.Wrapper>
                    <_.SubTitle>기한</_.SubTitle>
                    <_.DateInput type="date" />
                </_.Wrapper>
                <_.Wrapper>
                    <_.SubTitle>내용</_.SubTitle>
                    <_.TextArea placeholder="/를 눌러 다양한 기능을 사용하세요." />
                </_.Wrapper>
                <_.Wrapper>
                    <_.SubTitle>첨부파일</_.SubTitle>
                    <_.FileDrop>클릭하여 파일을 넣거나 드래그 하세요.</_.FileDrop>
                </_.Wrapper>
                <_.BtnGroup>
                    <BtnSecondary>취소</BtnSecondary>
                    <BtnPrimary>작성하기</BtnPrimary>
                </_.BtnGroup>
            </_.Group>
        </_.Container>
    );
}