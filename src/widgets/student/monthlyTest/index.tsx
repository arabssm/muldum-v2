"use client";

import * as _ from './style';
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import FormSection from './FormSection';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import type { MonthlyTestProps } from "@/shared/types";
import { saveDraftReport, submitReport, getDraftReport } from '@/shared/api/monthReport';
import { showToast } from '@/shared/ui/toast';
import Loading from '@/shared/ui/loading';
import { useTeams } from '@/shared/hooks/team';
import axiosInstance from '@/shared/lib/axiosInstance';

export default function MonthlyTest({ sections = [] }: MonthlyTestProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draftId, setDraftId] = useState<number | null>(null);
  const hasLoadedRef = useRef(false);
  const [monthlyReports, setMonthlyReports] = useState<any[]>([]);
  
  const { teams: majorTeams } = useTeams("전공동아리");
  const { teams: networkTeams } = useTeams("네트워크");
  
  // 폼 데이터 상태 (sections 순서: 주제, 목표, 사용언어·기술스택, 발생문제, 담당교사피드백, 멘토교사피드백)
  const [formData, setFormData] = useState({
    topic: '',
    goal: ['', ''],
    tech: '',
    problem: '',
    teacherFeedback: '',
    mentorFeedback: ''
  });

  // 페이지 진입 시 임시 저장된 데이터 및 월말평가 데이터 불러오기
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadData = async () => {
      try {
        // 임시 저장 데이터 불러오기
        const draftData = await getDraftReport();
        if (draftData) {
          setDraftId(draftData.reportId);
          setFormData({
            topic: draftData.topic || '',
            goal: draftData.goal && draftData.goal.length > 0 ? draftData.goal : ['', ''],
            tech: draftData.tech || '',
            problem: draftData.problem || '',
            teacherFeedback: draftData.teacherFeedback || '',
            mentorFeedback: draftData.mentorFeedback || ''
          });
          showToast.success('임시 저장된 데이터를 불러왔습니다');
        }

        // 월말평가 데이터 불러오기
        const currentMonth = new Date().getMonth() + 1;
        const allTeams = [...majorTeams, ...networkTeams];
        
        if (allTeams.length > 0) {
          const reportRequests = allTeams.map(team =>
            axiosInstance.get(`/tch/major/report`, {
              params: {
                team: team.id,
                month: currentMonth
              }
            }).catch(err => {
              console.error(`Failed to fetch report for team ${team.id}:`, err);
              return null;
            })
          );

          const reports = await Promise.all(reportRequests);
          const validReports = reports.filter(r => r !== null).map(r => r?.data);
          setMonthlyReports(validReports);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [majorTeams, networkTeams]);

  const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      // goal 배열에서 빈 문자열 제거
      const goalArray = formData.goal.filter(g => g.trim() !== '');
      const response = await saveDraftReport({
        ...formData,
        goal: goalArray
      });
      setDraftId(response.reportId);
      showToast.success(response.message || '임시 저장되었습니다');
    } catch (error) {
      console.error('임시 저장 실패:', error);
      showToast.error('임시 저장에 실패했습니다');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async () => {
    const goalArray = formData.goal.filter(g => g.trim() !== '');
    if (!formData.topic || goalArray.length === 0 || !formData.tech || !formData.problem) {
      showToast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    try {
      let reportId = draftId;
      const submitData = {
        ...formData,
        goal: goalArray
      };
      
      if (!reportId) {
        const draftResponse = await saveDraftReport(submitData);
        reportId = draftResponse.reportId;
      }
      
      await submitReport(reportId, submitData);
      showToast.success('월말평가가 제출되었습니다!');
      
      setFormData({
        topic: '',
        goal: ['', ''],
        tech: '',
        problem: '',
        teacherFeedback: '',
        mentorFeedback: ''
      });
      setDraftId(null);
    } catch (error) {
      console.error('월말평가 제출 실패:', error);
      showToast.error('월말평가 제출에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderActionButtons = () => {
    if (pathname.startsWith("/monthlyTest")) {
      return (
        <_.BtnGroup>
          <BtnSecondary onClick={() => router.push('/MonthlyList')}>이때동안 작성한 월말평가 보러가기</BtnSecondary>
          <BtnPrimary onClick={handleSaveDraft}>
            {isSavingDraft ? '저장 중...' : '임시저장'}
          </BtnPrimary>
          <BtnSecondary onClick={handleSubmit}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </BtnSecondary>
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

    // /team/[id] 페이지에서 월말평가 탭
    if (pathname.startsWith("/team/")) {
      return (
        <_.BtnGroup>
          <BtnSecondary onClick={() => router.push('/MonthlyList')}>내가 제출한 월말평가 조회</BtnSecondary>
          <BtnSecondary onClick={handleSaveDraft}>
            {isSavingDraft ? '저장 중...' : '임시저장'}
          </BtnSecondary>
          <BtnPrimary onClick={handleSubmit}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </BtnPrimary>
        </_.BtnGroup>
      );
    }

    return null;
  };

  // sections 순서에 맞게 field 매핑
  const fieldMapping = ['topic', 'goal', 'tech', 'problem', 'teacherFeedback', 'mentorFeedback'];

  if (isLoading) {
    return (
      <_.Container>
        <div>.<Loading /></div>
      </_.Container>
    );
  }

  return (
    <_.Container>
      {sections.map((section, i) => (
        <FormSection 
          key={i} 
          {...section}
          value={formData[fieldMapping[i] as keyof typeof formData]}
          onChange={(value) => handleInputChange(fieldMapping[i] as keyof typeof formData, value)}
        />
      ))}
      {renderActionButtons()}
    </_.Container>
  );
}