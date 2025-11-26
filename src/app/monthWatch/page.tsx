"use client"

import { Suspense } from "react";
import MonthWatch from "@/widgets/teacher/monthWatch";
import AuthConfirm from "@/components/AuthConfirm";

export default function NoticeWatchPage() {
  return (
    <AuthConfirm roles={['TEACHER']}>
      <Suspense fallback={<div>Loading...</div>}>
        <MonthWatch />
      </Suspense>
    </AuthConfirm>
  )
}