"use client";

import * as _ from './style';
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import FormSection from './FormSection';
import { sections } from './data';
import { useLoading } from "@/shared/hooks/useLoading";
import MonthlyTestSkeleton from "./skeleton";

function ActionButtons() {
  return (
    <_.BtnGroup>
      <BtnSecondary>이때동안 작성한 월말평가 보러가기</BtnSecondary>
      <BtnPrimary>제출하기</BtnPrimary>
    </_.BtnGroup>
  );
}

export default function MonthlyTest() {
  const { isLoading } = useLoading({ minLoadingTime: 700 });

  if (isLoading) {
    return <MonthlyTestSkeleton />;
  }
  return (
    <_.Container>
      {sections.map((section, i) => (
        <FormSection key={i} {...section} />
      ))}
      <ActionButtons />
    </_.Container>
  );
}