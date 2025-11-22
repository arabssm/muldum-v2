"use client";

import * as _ from './style';
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import FormSection from './FormSection';
import { useRouter, usePathname } from 'next/navigation';
import type { MonthlyTestProps } from "@/shared/types";

function ActionButtons() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/monthlyTest")) {
    return (
      <_.BtnGroup>
        <BtnSecondary onClick={() => router.push('/MonthlyList')}>이때동안 작성한 월말평가 보러가기</BtnSecondary>
        <BtnPrimary>제출하기</BtnPrimary>
      </_.BtnGroup>
    );
  }

  if (pathname === "/monthWatch") {
    return (
      <_.BtnGroup>
        <BtnSecondary onClick={() => router.push('/Feedback')}>피드백 후 반려</BtnSecondary>
        <BtnPrimary onClick={() => router.push('/monthCheck')}>승인</BtnPrimary>
      </_.BtnGroup>
    );
  }

  return null;
}

export default function MonthlyTest({ sections = [] }: MonthlyTestProps) {
  return (
    <_.Container>
      {sections.map((section, i) => (
        <FormSection key={i} {...section} />
      ))}
      <ActionButtons />
    </_.Container>
  );
}