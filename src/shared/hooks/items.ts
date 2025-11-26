import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ItemFormProps } from "@/shared/types/group";
import { createItemRequest, getItemPreview, getShippingPolicy } from "@/shared/api/items";
import { getUserInfo } from "@/shared/api/user";
import { showToast } from "@/shared/ui/toast";

interface InitialData {
  item?: string;
  price?: string;
  link?: string;
  reason?: string;
  drivePrice?: string;
  expectDrive?: string;
  quantity?: number;
}

interface UseItemFormOptions {
  handleSubmit?: ItemFormProps["handleSubmit"];
  initialData?: InitialData;
  isTemp?: boolean;
}

export function useItemForm(handleSubmit?: ItemFormProps["handleSubmit"], initialData?: InitialData, isTemp: boolean = true) {
  const router = useRouter();
  const [item, setItem] = useState(initialData?.item || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [drivePrice, setDrivePrice] = useState(initialData?.drivePrice || ""); 
  const [expectDrive, setExpectDrive] = useState(initialData?.expectDrive || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [reason, setReason] = useState(initialData?.reason || "");
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);

  // 링크 입력 필드에서 focus 해제 시 호출
  const handleLinkBlur = async () => {
    if (!link || !link.startsWith('http')) return;
    
    setIsFetchingPreview(true);
    try {
      const preview = await getItemPreview(link);
      setItem(preview.name);
      setPrice(preview.regularPrice);
      showToast.success('상품 정보를 가져왔습니다!');
    } catch (error) {
      console.error('상품 정보 조회 실패:', error);
      showToast.error('상품 정보를 가져올 수 없습니다!');
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!item) newErrors.item = "물품명을 입력해주세요";
    if (!price) newErrors.price = "가격을 입력해주세요";
    if (!drivePrice) newErrors.drivePrice = "배송비를 입력해주세요";
    if (!link) newErrors.link = "링크를 입력해주세요";
    if (!expectDrive) newErrors.expectDrive = "예상 도착일을 입력해주세요";
    if (!reason || reason.length < 10) newErrors.reason = "10자 이상 입력해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const internalSubmit = async () => {
    if (!validate() || isSubmitting) return;

    if (handleSubmit) {
      handleSubmit({
        item,
        price,
        drivePrice,
        link,
        reason,
        expectDrive,
        quantity,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 배송 정책 확인
      const shippingPolicy = await getShippingPolicy();
      
      if (shippingPolicy) {
        const itemPrice = parseFloat(price.replace(/,/g, '')) || 0;
        const deliveryPrice = parseFloat(drivePrice.replace(/,/g, '')) || 0;
        
        // 배송비 신청 불가 정책 확인
        if (shippingPolicy.youCantApplyForIgenship && deliveryPrice > 0) {
          showToast.error("현재 배송비 신청이 불가능합니다.");
          setIsSubmitting(false);
          return;
        }
        
        // 최소 금액 미달 시 배송비 필수
        if (itemPrice < shippingPolicy.atLeastShippingMoney && deliveryPrice === 0) {
          showToast.error(`${shippingPolicy.atLeastShippingMoney.toLocaleString()}원 미만 물품은 배송비를 입력해야 합니다.`);
          setIsSubmitting(false);
          return;
        }
      }

      const requestData = {
        product_name: item,
        quantity,
        price,
        productLink: link,
        reason,
        deliveryPrice: drivePrice,
        deliveryTime: expectDrive,
      };
      
      await createItemRequest(requestData, isTemp);

      showToast.success(isTemp ? "임시 신청이 완료되었습니다!" : "신청이 완료되었습니다!");
      setTimeout(() => {
        router.push("/itemList");
      }, 500);
    } catch (error) {
      console.error("물품 신청 실패:", error);
      showToast.error("신청에 실패했습니다!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecondary = () => router.push("/itemList");

  return {
    item,
    setItem,
    price,
    setPrice,
    drivePrice,
    setDrivePrice,
    link,
    setLink,
    reason,
    setReason,
    expectDrive,
    setExpectDrive,
    quantity,
    increase,
    decrease,
    errors,
    internalSubmit,
    handleSecondary,
    isSubmitting,
    isFetchingPreview,
    handleLinkBlur,
  };
}