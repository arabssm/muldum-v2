import * as _ from './style';
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";

export default function MonthlyTest() {
    return (
        <_.Container>
            <_.Wrapper>
                <_.Title>주제</_.Title>
                <_.Input placeholder='프로젝트 구현 시 적용 기술 작성, 스터디 동아리일 경우 스터디 주제 작성' />
            </_.Wrapper>
            <_.Wrapper>
                <_.Title>목표</_.Title>
                <_.Input placeholder='1.' />
                <_.Input placeholder='2.' />
            </_.Wrapper>
            <_.Wrapper>
                <_.Title>사용언어 · 기술스택</_.Title>
                <_.Input placeholder='프로젝트 구현 사용한 언어나 기술스택을 적어주세요' />
            </_.Wrapper>
            <_.Wrapper>
                <_.Title>발생문제와 어려웠던 점, 해결방안</_.Title>
                <_.Textarea placeholder='신청 사유를 10자 이상 입력해주세요' />
            </_.Wrapper>
            <_.Wrapper>
                <_.Title>담당 교사의 피드백안</_.Title>
                <_.Textarea placeholder='신청 사유를 10자 이상 입력해주세요' />
            </_.Wrapper>
            <_.Wrapper>
                <_.Title>멘토교사의 피드백</_.Title>
                <_.Textarea placeholder='신청 사유를 10자 이상 입력해주세요' />
            </_.Wrapper>
            <_.BtnGroup>
                <BtnSecondary>이때동안 작성한 월말평가 보러가기</BtnSecondary>
                <BtnPrimary>제출하기</BtnPrimary>
            </_.BtnGroup>
        </_.Container>
    );
}