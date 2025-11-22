"use client"

import { Suspense } from "react";
import MonthWatch from "@/widgets/teacher/monthWatch";

export default function NoticeWatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MonthWatch />
    </Suspense>
  )
}