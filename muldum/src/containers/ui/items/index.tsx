"use client";

import * as _ from './style';
import Image from 'next/image';
import { useState } from 'react';
import Group from '@/components/group';
import { BtnPrimary, BtnSecondary } from "@/components/bottom";
import { useItemForm } from '@/hooks/items';
import type { FormInputProps } from '@/types/group';

const LockedGroups = ["자율동아리", "졸업작품"] as const;
type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";

export default function Items() {
    const [active, setActive] = useState<GroupType | null>(null);
    const [lockedMessage, setLockedMessage] = useState<string>("");
    const [quantity, setQuantity] = useState(1);

    const { item, setItem, price, setPrice, link, setLink, reason, setReason, errors, validateForm } = useItemForm();

    const increase = () => setQuantity(prev => prev + 1);
    const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const quantityIcons = [ { onClick: increase, src: "/assets/Up.svg", alt: "Up" }, { onClick: decrease, src: "/assets/Drop.svg", alt: "Down" } ];

    const handleSubmit = () => validateForm() && alert("신청을 완료하였습니다");
    const handleSecondary = () => alert("이동페이지개설중");

    const FormInput = ({ label, value, setValue, placeholder, width, error, height }: FormInputProps & { height?: string }) => (
        <_.Wrapper>
            <_.Title>{label}</_.Title>
            {height
                ? <_.Textarea value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} style={{ height }} isError={!!error} />
                : <_.Input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} inputWidth={width} isError={!!error} />
            }
            {error ? <_.ErrorMessage><Image src="/assets/error.svg" alt="Error" width={16} height={16} />{error}</_.ErrorMessage> : null}
        </_.Wrapper>
    );

    return (
        <_.Container>
            <Group active={active} setActive={setActive} setMessage={setLockedMessage} />

            {LockedGroups.includes(active as typeof LockedGroups[number])
                ? <_.MessageWrapper><Image src="/assets/nob.svg" alt="No" width={120} height={120} /><_.Message>{lockedMessage}</_.Message></_.MessageWrapper>
                : active
                    ? <>
                        <_.Group>
                            <FormInput label="구입할 물품" value={item} setValue={setItem} placeholder="구입할 물품을 입력하세요" width="40rem" error={errors.item} />
                            <FormInput label="가격" value={price} setValue={setPrice} placeholder="가격을 입력하세요" width="10rem" error={errors.price} />
                            <_.Wrapper>
                                <_.Title>수량</_.Title>
                                <_.Number>
                                    <_.Num>{quantity}</_.Num>
                                    <_.Icons>{quantityIcons.map(({ onClick, src, alt }) => <div key={alt} onClick={onClick}><Image src={src} alt={alt} width={12} height={12} /></div>)}</_.Icons>
                                </_.Number>
                            </_.Wrapper>
                        </_.Group>
                        <FormInput label="물품링크" value={link} setValue={setLink} placeholder="링크를 입력하세요" width="62rem" error={errors.link} />
                        <FormInput label="신청사유" value={reason} setValue={setReason} placeholder="신청 사유를 10자 이상 입력해주세요" width="100%" height="20vh" error={errors.reason} />
                        <_.BtnGroup>
                            <BtnSecondary onClick={handleSecondary}>신청내역 보러가기</BtnSecondary>
                            <BtnPrimary onClick={handleSubmit}>신청하기</BtnPrimary>
                        </_.BtnGroup>
                    </>
                    : <_.MessageWrapper><Image src="/assets/choice.svg" alt="No" width={120} height={120} /><_.Message>물품 신청을 위해 폼을 선택해주세요</_.Message></_.MessageWrapper>
            }
        </_.Container>
    );
}