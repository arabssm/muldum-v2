import { useState } from 'react';
import * as _ from './style';
import Image from 'next/image';
import FormSection from '../monthlyTest/FormSection';
import { sections } from '../monthlyTest/data';

export default function MonthlyList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const months = ['3월', '5월', '4월'];

  return (
    <_.Container>
      {months.map((month, i) => (
        <_.MonthBlock key={i}>
          <_.MonthHeader onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            <Image
              src="/assets/toggle.svg"
              alt="토글"
              width={20}
              height={20}
              style={{
                transform: `rotate(${openIndex === i ? '90deg' : '0deg'})`,
                transition: 'transform 0.3s ease',
                marginRight: '8px',
              }}
            />
            <_.Month>{month}</_.Month>
          </_.MonthHeader>
          <_.Content isOpen={openIndex === i}>
            {sections.map((section, j) => (
              <FormSection key={j} {...section} />
            ))}
          </_.Content>
        </_.MonthBlock>
      ))}
    </_.Container>
  );
}