"use client";

import * as _ from './style';
import BlockNoteEditor from '@/shared/ui/tag';
import { useNoticeWrite } from '@/shared/hooks/useFilePreviews';
import { BtnPrimary, BtnSecondary } from '@/shared/ui/button';
import { useRouter } from 'next/navigation';
import { createItemGuide } from '@/shared/api/items';
import { showToast } from '@/shared/ui/toast';

export default function Caution() {
    const { content, setContent } = useNoticeWrite();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!content || content.trim() === '') {
            showToast.warning('내용을 입력해주세요.');
            return;
        }

        try {
            await createItemGuide(content);
            showToast.success('주의사항이 작성되었습니다.');
            router.push('/apply');
        } catch (error) {
            console.error('Failed to create guide:', error);
            showToast.error('주의사항 작성에 실패했습니다.');
        }
    };

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
                    <BtnPrimary onClick={handleSubmit}>작성하기</BtnPrimary>
                </_.BtnGroup>
            </_.Group>
        </_.Container>
    );
}