import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ItemFormProps } from "@/types/group";

export function useItemForm(handleSubmit?: ItemFormProps["handleSubmit"]) {
  const router = useRouter();
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [reason, setReason] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!item) newErrors.item = "물품명을 입력해주세요";
    if (!price) newErrors.price = "가격을 입력해주세요";
    if (!link) newErrors.link = "링크를 입력해주세요";
    if (!reason || reason.length < 10) newErrors.reason = "10자 이상 입력해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const internalSubmit = () => {
    if (!validate()) return;
    handleSubmit?.({ item, price, link, reason, quantity });
    alert("신청이 완료되었습니다 ✅");
  };

  const handleSecondary = () => router.push("/itemList");

  return {
    item,
    setItem,
    price,
    setPrice,
    link,
    setLink,
    reason,
    setReason,
    quantity,
    increase,
    decrease,
    errors,
    internalSubmit,
    handleSecondary,
  };
}