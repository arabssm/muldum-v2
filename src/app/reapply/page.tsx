"use client"

import { Suspense } from "react";
import Reapply from "@/widgets/student/reapply";

export default function ReapplyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reapply />
    </Suspense>
  )
}