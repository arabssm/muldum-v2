export interface ItemData {
    state: "승인 대기" | "승인 거부" | "승인 완료";
    color: string;
    name: string;
    link: string;
    quantity: number;
    reason: string;
}