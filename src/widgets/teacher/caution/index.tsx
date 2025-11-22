"use client";

import * as _ from './style';
import BlockNoteEditor from '@/shared/ui/tag';
import { useNoticeWrite } from '@/shared/hooks/useFilePreviews';
import { BtnPrimary, BtnSecondary } from '@/shared/ui/button';
import { useRouter } from 'next/navigation';

export default function Caution() {
    const { setContent } = useNoticeWrite();
    const router = useRouter();

    return (
        <_.Container>
            <_.Group>
                <_.Title>주의사항 작성</_.Title>
                <_.Wrapper>
                    <_.SubTitle>내용</_.SubTitle>
                    <_.detail>
                        <BlockNoteEditor
                            initialContent={''}
                            onChange={(val) => setContent(val)}
                        />
                    </_.detail>
                </_.Wrapper>
                <_.BtnGroup>
                    <BtnSecondary onClick={() => router.push('/apply')}>취소</BtnSecondary>
                    <BtnPrimary>작성하기</BtnPrimary>
                </_.BtnGroup>
            </_.Group>
        </_.Container>
    );
}