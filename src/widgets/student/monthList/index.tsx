"use client";

import { useState } from 'react';
import * as _ from './style';
import Image from 'next/image';
import FormSection from '../monthlyTest/FormSection';
import { useMonthReports } from '@/shared/hooks/useMonthReports';
import Loading from '@/shared/ui/loading';

export default function MonthlyList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const initialReports = [
    { id: 'report_3', month: '3월', sections: [] },
    { id: 'report_4', month: '4월', sections: [] },
    { id: 'report_5', month: '5월', sections: [] },
  ];

  const { reports, loading, error, fetchReport } = useMonthReports(initialReports);

  const handleToggle = async (index: number) => {
    await fetchReport(index);
    setOpenIndex(openIndex === index ? null : index);
  };

  if (error) return <div>{error}</div>;

  return (
    <_.Container>
      {reports.map((monthReport, i) => (
        <_.MonthBlock key={i}>
          <_.MonthHeader onClick={() => handleToggle(i)}>
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
            <_.Month>{monthReport.month}</_.Month>
          </_.MonthHeader>
          <_.Content isOpen={openIndex === i}>
            {loading && <Loading />}
            {monthReport.sections.map((section, j) => (
              <FormSection key={j} {...section} />
            ))}
          </_.Content>
        </_.MonthBlock>
      ))}
    </_.Container>
  );
}