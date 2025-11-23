"use client";

import { useState, useEffect } from 'react';
import * as _ from './style';
import Image from 'next/image';
import FormSection from '../monthlyTest/FormSection';
import { getReportList, getReportDetail } from '@/shared/api/monthReport';
import type { MonthReportSimpleResponse, MonthReportDetailResponse } from '@/shared/api/monthReport';
import { showToast } from '@/shared/ui/toast';

interface ReportWithDetail extends MonthReportSimpleResponse {
  detail?: MonthReportDetailResponse;
}

export default function MonthlyList() {
  const [reports, setReports] = useState<ReportWithDetail[]>([]);
  const [month, setMonth] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReportList();
        setReports(data.reports || []);
        setMonth(data.month || 0);
      } catch (error) {
        console.error('월말평가 목록 조회 실패:', error);
        showToast.error('월말평가 목록을 불러오는데 실패했습니다');
        setReports([]);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleToggle = async (index: number) => {
    const report = reports[index];

    // 이미 열려있으면 닫기
    if (openIndex === index) {
      setOpenIndex(null);
      return;
    }

    // 이미 상세 데이터가 있으면 그냥 열기
    if (report.detail) {
      setOpenIndex(index);
      return;
    }

    // 상세 데이터 가져오기
    try {
      setLoading(true);
      const detail = await getReportDetail(report.reportId);
      setReports(prev => {
        const newReports = [...prev];
        newReports[index].detail = detail;
        return newReports;
      });
      setOpenIndex(index);
    } catch (error) {
      console.error('월말평가 상세 조회 실패:', error);
      showToast.error('월말평가 상세 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUBMIT':
        return '제출됨';
      case 'DRAFT':
        return '임시저장';
      default:
        return status;
    }
  };

  if (isInitialLoading) {
    return (
      <_.Container>
        <div>로딩 중...</div>
      </_.Container>
    );
  }

  if (reports.length === 0) {
    return (
      <_.Container>
        <_.EmptyMessage>작성한 월말평가가 없습니다</_.EmptyMessage>
      </_.Container>
    );
  }

  return (
    <_.Container>
      {reports.map((report, i) => (
        <_.MonthBlock key={report.reportId}>
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
            <_.Month>{month > 0 ? `${month}월` : ''}</_.Month>
          </_.MonthHeader>
          <_.Content isOpen={openIndex === i}>
            {loading && openIndex === i && <div>로딩 중...</div>}
            {report.detail && (
              <>
                <FormSection 
                  title="주제" 
                  must={true} 
                  placeholders={['']} 
                  value={report.detail.topic}
                  onChange={() => {}}
                  readOnly={true}
                />
                <FormSection 
                  title="목표" 
                  must={true} 
                  placeholders={['1.', '2.']} 
                  value={report.detail.goal}
                  onChange={() => {}}
                  readOnly={true}
                />
                <FormSection 
                  title="사용언어 · 기술스택" 
                  must={true} 
                  placeholders={['']} 
                  value={report.detail.tech}
                  onChange={() => {}}
                  readOnly={true}
                />
                <FormSection 
                  title="발생문제와 어려웠던 점, 해결방안" 
                  must={true} 
                  placeholders={['']} 
                  isTextarea={true}
                  value={report.detail.problem}
                  onChange={() => {}}
                  readOnly={true}
                />
                <FormSection 
                  title="담당 교사의 피드백" 
                  must={false} 
                  placeholders={['']} 
                  isTextarea={true}
                  value={report.detail.teacherFeedback || ''}
                  onChange={() => {}}
                  readOnly={true}
                />
                <FormSection 
                  title="멘토교사의 피드백" 
                  must={false} 
                  placeholders={['']} 
                  isTextarea={true}
                  value={report.detail.mentorFeedback || ''}
                  onChange={() => {}}
                  readOnly={true}
                />
              </>
            )}
          </_.Content>
        </_.MonthBlock>
      ))}
    </_.Container>
  );
}