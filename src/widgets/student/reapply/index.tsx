"use client";

import * as _ from "./style";
import ItemForm from "@/components/itemForm";
import { data } from "./data";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getItemList, getCrawlRecommendations } from "@/shared/api/items";

interface AlternativeItem {
  image: string;
  source: string;
  name: string;
  price: string;
  link: string;
}

export default function Main() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');
  const [alternatives, setAlternatives] = useState<AlternativeItem[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>(null);

  useEffect(() => {
    if (!itemId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. 물품 목록에서 해당 아이템 찾기
        const allItems = await getItemList();
        const targetItem = allItems.find((item: any) => item.id.toString() === itemId);
        
        if (!targetItem) {
          console.error('아이템을 찾을 수 없습니다');
          return;
        }

        // 2. 폼 초기값 설정
        setInitialFormData({
          item: targetItem.product_name || "",
          price: targetItem.price?.toString() || "",
          link: targetItem.productLink || "",
          reason: targetItem.reason || "",
          drivePrice: targetItem.deliveryPrice?.toString() || "",
          expectDrive: targetItem.deliveryTime || "",
          quantity: targetItem.quantity || 1,
        });

        // 3. 원래 신청한 쇼핑몰 확인
        let source: string | undefined;
        if (targetItem.type === 'NETWORK') {
          source = '11st';
        } else if (targetItem.type === 'DEVICEMART') {
          source = 'devicemart';
        }
        
        // 4. 상품명을 전달하여 추천 물품 가져오기
        const recommendations = await getCrawlRecommendations(targetItem.product_name, 10, source);
        console.log('추천 물품:', recommendations);
        
        // 5. 추천 결과를 화면에 표시
        if (recommendations.items && recommendations.items.length > 0) {
          const transformedData = recommendations.items.map((item: any) => ({
            image: item.image || '/assets/default-item.jpg',
            source: '11번가',
            name: item.name,
            price: item.price,
            link: item.detailUrl,
          }));
          
          setAlternatives(transformedData);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  return (
    <_.Container>
      <_.Title>물품 재신청</_.Title>
      {initialFormData ? (
        <ItemForm hideClubSelect initialData={initialFormData} />
      ) : (
        <div>로딩 중...</div>
      )}
      <_.Title>비슷한 물품 추천</_.Title>
      {isLoading ? (
        <div>추천 물품 로딩 중...</div>
      ) : (
        <_.Group>
          {alternatives.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <_.Box bgImage={item.image}>
                <_.TextGroup>
                  <_.Text>{item.name}</_.Text>
                  <_.Text>{item.price}원</_.Text>
                </_.TextGroup>
              </_.Box>
            </a>
          ))}
        </_.Group>
      )}
    </_.Container>
  );
}
