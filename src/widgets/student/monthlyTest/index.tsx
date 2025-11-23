"use client";

import * as _ from './style';
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import FormSection from './FormSection';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import type { MonthlyTestProps } from "@/shared/types";
import { saveDraftReport, submitReport, getDraftReport } from '@/shared/api/monthReport';
import { showToast } from '@/shared/ui/toast';

export default function MonthlyTest({ sections = [] }: MonthlyTestProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draftId, setDraftId] = useState<number | null>(null);
  const hasLoadedRef = useRef(false);
  
  // 폼 데이터 상태 (sections 순서: 주제, 목표, 사용언어·기술스택, 발생문제, 담당교사피드백, 멘토교사피드백)
  const [formData, setFormData] = useState({
    topic: '',
    goal: ['', ''],
    tech: '',
    problem: '',
    teacherFeedback: '',
    mentorFeedback: ''
  });

  // 페이지 진입 시 임시 저장된 데이터 불러오기
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadDraftData = async () => {
      try {
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
      } catch (error) {
        console.error('임시 저장 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraftData();
  }, []);

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
      showToast.success(response.message);
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
          <BtnSecondary onClick={handleSaveDraft}>
            {isSavingDraft ? '저장 중...' : '임시저장'}
          </BtnSecondary>
          <BtnPrimary onClick={handleSubmit}>
            {isSubmitting ? '제출 중...' : '제출하기'}
          </BtnPrimary>
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
        <div>로딩 중...</div>
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