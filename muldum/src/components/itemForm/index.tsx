"use client";

import * as _ from "./style";
import Image from "next/image";
import { BtnPrimary, BtnSecondary } from "@/components/bottom";
import type { ItemFormProps } from "@/types/group";

export default function ItemForm({
    item, setItem, price, setPrice,
    link, setLink, reason, setReason,
    errors, quantity, increase, decrease,
    handleSubmit, handleSecondary, FormInput,
}: ItemFormProps) {
    const quantityIcons = [
        { onClick: increase, src: "/assets/Up.svg", alt: "Up" },
        { onClick: decrease, src: "/assets/Drop.svg", alt: "Down" },
    ];

    return (
        <>
            <_.Group>
                <FormInput
                    label="구입할 물품"
                    value={item}
                    setValue={setItem}
                    placeholder="구입할 물품을 입력하세요"
                    width="40rem"
                    error={errors.item}
                />
                <FormInput
                    label="가격"
                    value={price}
                    setValue={setPrice}
                    placeholder="가격을 입력하세요"
                    width="10rem"
                    error={errors.price}
                />
                <_.Wrapper>
                    <_.Title>수량</_.Title>
                    <_.Number>
                        <_.Num>{quantity}</_.Num>
                        <_.Icons>
                            {quantityIcons.map(({ onClick, src, alt }) => (
                                <div key={alt} onClick={onClick}>
                                    <Image src={src} alt={alt} width={12} height={12} />
                                </div>
                            ))}
                        </_.Icons>
                    </_.Number>
                </_.Wrapper>
            </_.Group>
            <FormInput
                label="물품링크"
                value={link}
                setValue={setLink}
                placeholder="링크를 입력하세요"
                width="62rem"
                error={errors.link}
            />
            <FormInput
                label="신청사유"
                value={reason}
                setValue={setReason}
                placeholder="신청 사유를 10자 이상 입력해주세요"
                width="100%"
                height="20vh"
                error={errors.reason}
            />
            <_.BtnGroup>
                <BtnSecondary onClick={handleSecondary}>신청내역 보러가기</BtnSecondary>
                <BtnPrimary onClick={handleSubmit}>신청하기</BtnPrimary>
            </_.BtnGroup>
        </>
    );
}