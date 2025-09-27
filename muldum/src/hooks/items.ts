import { useState } from "react";

export function useItemForm() {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [reason, setReason] = useState("");

  const [errors, setErrors] = useState<{ item?: string; price?: string; link?: string; reason?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!item.trim()) newErrors.item = "구입할 물품을 입력해주세요.";
    if (!price.trim()) newErrors.price = "가격을 입력해주세요.";
    if (!link.trim()) newErrors.link = "물품 링크를 입력해주세요.";
    if (reason.trim().length < 10) newErrors.reason = "신청 사유는 10자 이상 입력해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { item, setItem, price, setPrice, link, setLink, reason, setReason, errors, validateForm };
}