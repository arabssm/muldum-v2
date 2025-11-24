"use client";

import * as _ from "./style";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ItemForm from "@/components/itemForm";
import { updateItem } from "@/shared/api/items";
import { showToast } from "@/shared/ui/toast";
import Loading from "@/shared/ui/loading";

export default function ItemEdit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');
  const itemData = searchParams.get('data');
  
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!itemId) {
      showToast.error("물품 ID가 없습니다.");
      router.back();
      return;
    }

    if (!itemData) {
      showToast.error("물품 정보를 찾을 수 없습니다.");
      router.back();
      return;
    }

    try {
      const data = JSON.parse(decodeURIComponent(itemData));
      
      const formData = {
        item: data.product_name || '',
        price: typeof data.price === 'string' ? data.price : data.price?.toString() || '',
        link: data.product_link || '',
        reason: data.reason || '',
        quantity: data.quantity || 1,
        drivePrice: data.deliveryPrice || '',
        expectDrive: data.deliveryTime ? new Date(data.deliveryTime).toISOString().split('T')[0] : '',
      };
      
      setInitialData(formData);
    } catch (error) {
      console.error('Failed to parse item data:', error);
      showToast.error("물품 정보를 불러오는데 실패했습니다.");
      router.back();
    }
  }, [itemId, itemData, router]);

  const handleSubmit = async (data: any) => {
    if (!itemId) return;

    try {
      const updateData = {
        product_name: data.item,
        quantity: data.quantity,
        price: data.price,
        product_link: data.link,
        reason: data.reason,
        delivery_price: data.drivePrice,
        delivery_time: data.expectDrive ? `${data.expectDrive}T00:00:00` : undefined,
      };

      await updateItem(parseInt(itemId, 10), updateData);
      showToast.success("물품이 수정되었습니다!");
      router.push('/itemList');
    } catch (error) {
      console.error('Failed to update item:', error);
      showToast.error("물품 수정에 실패했습니다.");
    }
  };

  if (!initialData) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><Loading /></div>;
  }

  return (
    <_.Container>
      <ItemForm handleSubmit={handleSubmit} initialData={initialData} isEdit={true} />
    </_.Container>
  );
}
