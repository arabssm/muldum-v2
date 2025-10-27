"use client"

import * as _ from './style';
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface NoticeDetailProps {
    id: string
}

export default function NoticeDetail({id}: NoticeDetailProps) {
    const router = useRouter();

    return (
        <_.Container>
            <Image src="/assets/arrow.svg" alt="뒤로가기" width={24} height={24} style={{ cursor: "pointer" }} onClick={() => router.back()} />
            <_.Title>TSMC, AI칩 수요 견조 재확인…삼성·SK, HBM 사업 성장세 '쾌청'</_.Title>
            <_.Group>
                <_.Subtitle>등록일 : 2025.04.21. 오후 1:42</_.Subtitle>
                <_.Subtitle>마감일 : 2025.04.21. 오후 1:42</_.Subtitle>
                <_.Subtitle>작성자 : 김에빈</_.Subtitle>
            </_.Group>
            <_.ImgGroup>
                <Image src="/assets/temporary.svg" alt='임시' width={1600} height={414} style={{ width: "100%", height: "auto" }} />
            </_.ImgGroup>
            <_.TopContent>AI 가속기 수요 굳건…TSMC,2.5D 패키징 생산능력 2배 확대</_.TopContent>
            <p>앞서 TSMC는 지난 17일 1분기 실적발표 컨퍼런스콜에서 올해 설비투자(CapEx) 규모를 380억~420억 달러를 제시했다. <br /> 최근 중국 딥시크와 같은 저비용·고효율 AI 모델의 등장, 미국의 관세 압박 등으로 AI 인프라 투자에 대한 불확실성이 높아졌으나, 지난해 발표한 계획을 그대로 유지했다.</p>
        </_.Container>
    );
}