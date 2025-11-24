"use client";

import * as _ from "./style";
import Image from "next/image";
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import { FormInput } from "./FormInput";
import { useItemForm } from "@/shared/hooks/items";
import type { ItemFormProps } from "@/shared/types/group";
import { useState } from "react";

interface ExtendedItemFormProps extends ItemFormProps {
  hideClubSelect?: boolean;
  isTemp?: boolean;
  isEdit?: boolean;
  initialData?: {
    item?: string;
    price?: string;
    link?: string;
    reason?: string;
    drivePrice?: string;
    expectDrive?: string;
    quantity?: number;
  };
}

export default function ItemForm({ handleSubmit, hideClubSelect = false, isTemp = true, isEdit = false, initialData }: ExtendedItemFormProps) {
  const {
    item, setItem,
    price, setPrice,
    link, setLink,
    reason, setReason,
    drivePrice, setDrivePrice,
    expectDrive, setExpectDrive,
    quantity, increase, decrease,
    errors, internalSubmit, handleSecondary,
    handleLinkBlur
  } = useItemForm(handleSubmit, initialData, isTemp);

  const [club, setClub] = useState("");

  const quantityIcons = [
    { onClick: increase, src: "/assets/Up.svg", alt: "Up" },
    { onClick: decrease, src: "/assets/Drop.svg", alt: "Down" },
  ];

  const clubOptions = [
    "나의 동아리",
    "반짝반짝빛나는밤"
  ];

  return (
    <>
      {!hideClubSelect && (
        <_.SelectGroup>
          <_.SelectWrapper>
            <_.Select id="club" value={club} onChange={(e) => setClub(e.target.value)}>
              <option value="">동아리 선택</option>
              {clubOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </_.Select>
            <Image src="/assets/toggle.svg" alt="토글" width={20} height={20}
              style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%) rotate(90deg)" }}
            />
          </_.SelectWrapper>
        </_.SelectGroup>
      )}
      <_.Group>
        <FormInput label="구입할 물품" value={item} setValue={setItem} placeholder="구입할 물품을 입력하세요" width="40rem" error={errors.item} />
        <FormInput label="가격" value={price} setValue={setPrice} placeholder="가격을 입력하세요" width="10rem" error={errors.price} />
        <FormInput label="배송비" value={drivePrice} setValue={setDrivePrice} placeholder="가격을 입력하세요" width="10rem" error={errors.drivePrice} />
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
      <_.Group>
        <FormInput label="물품링크" value={link} setValue={setLink} onBlur={handleLinkBlur} placeholder="링크를 입력하세요" width="62rem" error={errors.link} />
        <FormInput label="예상 도착일" value={expectDrive} setValue={setExpectDrive} type="date" width="10rem" error={errors.expectDrive} />
      </_.Group>
      <FormInput label="신청사유" value={reason} setValue={setReason} placeholder="신청 사유를 10자 이상 입력해주세요" width="100%" height="20vh" error={errors.reason} />
      <_.BtnGroup>
        <BtnSecondary onClick={handleSecondary}>신청내역 보러가기</BtnSecondary>
        <BtnPrimary onClick={internalSubmit}>{isEdit ? "수정하기" : "신청하기"}</BtnPrimary>
      </_.BtnGroup>
    </>
  );
}
