"use client";

import * as _ from "./style";
import ItemForm from "@/components/itemForm";

export default function Main() {
  return (
    <_.Container>
      <_.Title>물품 재신청</_.Title>
      <_.Title style={{ marginTop: "2rem", fontSize: "1.25rem", fontWeight: 500 }}>
        추천 물품
      </_.Title>
      <ItemForm />
    </_.Container>
  );
}
