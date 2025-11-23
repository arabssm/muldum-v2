"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styled from "@emotion/styled";
import FormSection from "@/widgets/student/monthlyTest/FormSection";
import { getTeacherReportDetail } from "@/shared/api/monthReport";
import type { MonthReportDetailResponse } from "@/shared/api/monthReport";
import { showToast } from "@/shared/ui/toast";
import Loading from "@/shared/ui/loading";
import { sections } from "@/widgets/student/monthlyTest/data";

export default function MonthWatch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("report_id");
  const [reportData, setReportData] = useState<MonthReportDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reportId) return;

    const fetchReportDetail = async () => {
      try {
        setLoading(true);
        const data = await getTeacherReportDetail(Number(reportId));
        setReportData(data);
      } catch (error) {
        console.error('월말평가 상세 조회 실패:', error);
        showToast.error('월말평가를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [reportId]);

  if (loading) return <Loading />;
  
  if (!reportData) {
    return <div>데이터를 찾을 수 없습니다</div>;
  }

  const formData = {
    topic: reportData.topic,
    goal: reportData.goal,
    tech: reportData.tech,
    problem: reportData.problem,
    teacherFeedback: reportData.teacherFeedback || '',
    mentorFeedback: reportData.mentorFeedback || ''
  };

  const fieldMapping = ['topic', 'goal', 'tech', 'problem', 'teacherFeedback', 'mentorFeedback'];

  return (
    <Container>
      <Image
        src="/assets/arrow.svg"
        alt="화살표"
        width={24}
        height={24}
        onClick={() => router.back()}
        style={{ cursor: "pointer" }}
      />
      <FormContainer>
        {sections.map((section, i) => (
          <FormSection 
            key={i} 
            {...section}
            value={formData[fieldMapping[i] as keyof typeof formData]}
            onChange={() => {}}
            readOnly={true}
          />
        ))}
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
  gap: 2.5rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.6rem;
`;
