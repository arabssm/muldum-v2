"use client";

import * as _ from './style';
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import FormSection from './FormSection';
import { sections } from './data';
import { useRouter, usePathname } from 'next/navigation';

function ActionButtons() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/MonthlyTest") {
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
        <BtnSecondary onClick={() => router.push('/MonthlyList')}>피드백 후 반려</BtnSecondary>
        <BtnPrimary>승인</BtnPrimary>
      </_.BtnGroup>
    );
  }

  return null;
}

export default function MonthlyTest() {
  return (
    <_.Container>
      {sections.map((section, i) => (
        <FormSection key={i} {...section} />
      ))}
      <ActionButtons />
    </_.Container>
  );
}
