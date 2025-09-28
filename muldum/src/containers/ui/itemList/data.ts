import type { ItemData } from '@/types/list';

export const items: ItemData[] = [
    {
        state: "승인 대기",
        color: "#B2B2B2",
        name: "고구마빵",
        link: "https://www.kurly.com/goods/1000017173",
        quantity: 1,
        reason: "고구마빵을 사서 팀원 뿐만 아니라 인턴들과 함께 나누어 먹으려고 구입했습니다. 다른 팀에도 선물해 교우관계를 형성할 것입니다. 반려하신다면 받아주실 때까지 감자빵을 신청하겠습니다.",
    },
    {
        state: "승인 완료",
        color: "#60D18F",
        name: "페스츄리 약과",
        link: "https://www.kurly.com/goods/1000017173",
        quantity: 4,
        reason: "페스츄리 약과를 먹으면 마치 약 먹은 듯 힘이 솟아나기 때문에 꼭 구입하고싶습니다",
    },
    {
        state: "승인 거부",
        color: "#DF3636",
        name: "보성녹차 20개입",
        link: "https://www.kurly.com/goods/1000017173",
        quantity: 20,
        reason: "제발승인해주세요제발승인해주세요제발승인해주세요제발승인해주세요제발승인해주세요",
    },
    {
        state: "승인 거부",
        color: "#DF3636",
        name: "마우스 키패드",
        link: "https://www.kurly.com/goods/1000017173",
        quantity: 20,
        reason: "저를 위한게 아니라 저희 팀원 모두를 위한 것 입니다...",
    },
];