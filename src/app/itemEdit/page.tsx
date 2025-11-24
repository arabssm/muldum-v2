"use client"

import { Suspense } from "react";
import ItemEdit from "@/widgets/student/itemEdit";
import Loading from "@/shared/ui/loading";

function ItemEditContent() {
  return <ItemEdit />
}

export default function ItemEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loading /></div>}>
      <ItemEditContent />
    </Suspense>
  )
}
