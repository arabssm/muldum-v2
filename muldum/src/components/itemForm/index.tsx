"use client";

import * as _ from "./style";
import Image from "next/image";
import { BtnPrimary, BtnSecondary } from "@/components/bottom";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ItemFormProps } from '@/types/group';

export default function ItemForm({ handleSubmit }: ItemFormProps) {
  const router = useRouter();
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [reason, setReason] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const internalSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!item) newErrors.item = "물품명을 입력해주세요";
    if (!price) newErrors.price = "가격을 입력해주세요";
    if (!link) newErrors.link = "링크를 입력해주세요";
    if (!reason || reason.length < 10) newErrors.reason = "10자 이상 입력해주세요";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    handleSubmit?.({ item, price, link, reason, quantity });
    alert("신청이 완료되었습니다 ✅");
  };

  const handleSecondary = () => {
    router.push("/itemList");
  };

  const FormInput = ({ label, value, setValue, placeholder, width, height, error }: any) => (
    <_.Wrapper>
      <_.Title>{label}</_.Title>
      {height ? (
        <_.Textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          style={{ height }}
          isError={!!error}
        />
      ) : (
        <_.Input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          inputWidth={width}
          isError={!!error}
        />
      )}
      {error && (
        <_.ErrorMessage>
          <Image src="/assets/error.svg" alt="Error" width={16} height={16} />
          {error}
        </_.ErrorMessage>
      )}
    </_.Wrapper>
  );

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
        <BtnPrimary onClick={internalSubmit}>신청하기</BtnPrimary>
      </_.BtnGroup>
    </>
  );
}