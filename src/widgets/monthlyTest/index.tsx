import * as _ from './style';
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import FormSection from './FormSection';
import { sections } from './data';

function ActionButtons() {
  return (
    <_.BtnGroup>
      <BtnSecondary>이때동안 작성한 월말평가 보러가기</BtnSecondary>
      <BtnPrimary>제출하기</BtnPrimary>
    </_.BtnGroup>
  );
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