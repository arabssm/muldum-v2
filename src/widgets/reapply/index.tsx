"use client";

import * as _ from "./style";
import ItemForm from "@/components/itemForm";
import { data } from "./data";
import { useLoading } from "@/shared/hooks/useLoading";
import ReapplySkeleton from "./skeleton";

export default function Main() {
  const { isLoading } = useLoading({ minLoadingTime: 600 });

  if (isLoading) {
    return <ReapplySkeleton />;
  }
  return (
    <_.Container>
      <_.Title>물품 재신청</_.Title>
      <ItemForm />
      <_.Title>비슷한 물품 추천</_.Title>
      <_.Group>
        {data.map((item, index) => (
          <_.Box key={index} bgImage={item.image}>
            <_.TextGroup>
              <_.Small>{item.source}</_.Small>
              <_.Text>{item.name}</_.Text>
            </_.TextGroup>
          </_.Box>
        ))}
      </_.Group>
    </_.Container>
  );
}
