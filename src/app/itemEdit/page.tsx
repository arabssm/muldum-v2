"use client"

import { Suspense } from "react";
import ItemEdit from "@/widgets/student/itemEdit";

function ItemEditContent() {
  return <ItemEdit />
}

export default function ItemEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>}>
      <ItemEditContent />
    </Suspense>
  )
}
