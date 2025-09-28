"use client";

import * as _ from "./style";
import Image from "next/image";
import { useState } from "react";
import Group from "@/components/group";
import { useItemForm } from "@/hooks/items";
import ItemForm from "@/components/itemForm";

const LockedGroups = ["자율동아리", "졸업작품"] as const;
type GroupType = "전공동아리" | "네트워크" | "자율동아리" | "졸업작품";

export default function Items() {
    const [active, setActive] = useState<GroupType | null>(null);
    const [lockedMessage, setLockedMessage] = useState<string>("");
    const [quantity, setQuantity] = useState(1);

    const { item, setItem, price, setPrice, link, setLink, reason, setReason, errors, validateForm } = useItemForm();

    const increase = () => setQuantity(prev => prev + 1);
    const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleSubmit = () => validateForm() && alert("신청을 완료하였습니다");
    const handleSecondary = () => alert("이동페이지개설중");

    const FormInput = ({ label, value, setValue, placeholder, width, error, height }: any) => (
        <_.Wrapper>
            <_.Title>{label}</_.Title>
            {height ? (
                <_.Textarea value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} style={{ height }} isError={!!error} />
            ) : (
                <_.Input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} inputWidth={width} isError={!!error} />
            )}
            {error && (
                <_.ErrorMessage>
                    <Image src="/assets/error.svg" alt="Error" width={16} height={16} />
                    {error}
                </_.ErrorMessage>
            )}
        </_.Wrapper>
    );

    return (
        <_.Container>
            <Group active={active} setActive={setActive} setMessage={setLockedMessage} />

            {LockedGroups.includes(active as typeof LockedGroups[number]) ? (
                <_.MessageWrapper>
                    <Image src="/assets/nob.svg" alt="No" width={120} height={120} />
                    <_.Message>{lockedMessage}</_.Message>
                </_.MessageWrapper>
            ) : active ? (
                <ItemForm
                    item={item} setItem={setItem}
                    price={price} setPrice={setPrice}
                    link={link} setLink={setLink}
                    reason={reason} setReason={setReason}
                    errors={errors} quantity={quantity}
                    increase={increase} decrease={decrease}
                    handleSubmit={handleSubmit}
                    handleSecondary={handleSecondary}
                    FormInput={FormInput}
                />
            ) : (
                <_.MessageWrapper>
                    <Image src="/assets/choice.svg" alt="No" width={120} height={120} />
                    <_.Message>물품 신청을 위해 폼을 선택해주세요</_.Message>
                </_.MessageWrapper>
            )}
        </_.Container>
    );
}