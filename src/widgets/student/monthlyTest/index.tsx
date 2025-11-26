"use client";

import * as _ from './style';
import { BtnPrimary, BtnSecondary } from "@/shared/ui/button";
import FormSection from './FormSection';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import type { MonthlyTestProps } from "@/shared/types";
import { saveDraftReport, submitReport, getDraftReport, getTeacherReportList } from '@/shared/api/monthReport';
import type { MonthReportSimpleResponse } from '@/shared/api/monthReport';
import { showToast } from '@/shared/ui/toast';
import Loading from '@/shared/ui/loading';
import { useTeams } from '@/shared/hooks/team';
import { getUserInfo } from '@/shared/api/user';

export default function MonthlyTest({ sections = [] }: MonthlyTestProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draftId, setDraftId] = useState<number | null>(null);
  const hasLoadedRef = useRef(false);
  const [userType, setUserType] = useState<string | null>(null);
  
  // 교사용 상태
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [reports, setReports] = useState<MonthReportSimpleResponse[]>([]);
  
  const { teams: majorTeams } = useTeams("전공동아리");
  
  // 폼 데이터 상태 (sections 순서: 주제, 목표, 사용언어·기술스택, 발생문제, 담당교사피드백, 멘토교사피드백)
  const [formData, setFormData] = useState({
    topic: '',
    goal: ['', ''],
    tech: '',
    problem: '',
    teacherFeedback: '',
    mentorFeedback: ''
  });

  // 사용자 타입 확인
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const userInfo = await getUserInfo();
        setUserType(userInfo.user_type);
      } catch (error) {
        console.error('Failed to fetch user type:', error);
      }
    };
    fetchUserType();
  }, []);

  // 교사용: 기본값을 "전체"(null)로 설정
  useEffect(() => {
    if (userType === "TEACHER" && selectedTeamId === null && majorTeams.length === 0) {
      // 팀 목록이 로드되기 전에는 null 유지
      return;
    }
  }, [userType, majorTeams, selectedTeamId]);

  // 교사용: 선택된 팀의 월말평가 목록 조회
  useEffect(() => {
    if (userType !== "TEACHER") return;

    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const data = await getTeacherReportList(selectedTeamId);
        console.log("Fetched reports data:", data);
        // 데이터가 배열인지 확인하고 설정
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          console.error("Reports data is not an array:", data);
          setReports([]);
        }
      } catch (error) {
        console.error("월말평가 목록 조회 실패:", error);
        showToast.error("월말평가 목록을 불러오는데 실패했습니다");
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [userType, selectedTeamId]);

  // 학생용: 페이지 진입 시 임시 저장된 데이터 불러오기
  useEffect(() => {
    if (userType !== "STUDENT" || hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadData = async () => {
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
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userType]);

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

  const handleReportClick = (reportId: number) => {
    router.push(`/monthWatch?report_id=${reportId}`);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "임시저장";
      case "SUBMITTED":
        return "제출완료";
      case "REVIEWED":
        return "검토완료";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "#999";
      case "SUBMITTED":
        return "#4A90E2";
      case "REVIEWED":
        return "#27AE60";
      default:
        return "#333";
    }
  };

  // sections 순서에 맞게 field 매핑
  const fieldMapping = ['topic', 'goal', 'tech', 'problem', 'teacherFeedback', 'mentorFeedback'];

  if (isLoading) {
    return (
      <_.Container>
        <Loading />
      </_.Container>
    );
  }

  // 교사용 UI
  if (userType === "TEACHER") {
    const allTeams = [{ id: null, name: "전체" }, ...majorTeams];

    return (
      <_.Container>
        <_.TeamSelector>
          {allTeams.map((team) => (
            <_.TeamText
              key={team.id ?? 'all'}
              isActive={selectedTeamId === team.id}
              onClick={() => setSelectedTeamId(team.id)}
            >
              {team.name}
            </_.TeamText>
          ))}
        </_.TeamSelector>

        <_.ReportsContainer>
          {!Array.isArray(reports) || reports.length === 0 ? (
            <_.EmptyMessage>월말평가가 없습니다</_.EmptyMessage>
          ) : (
            reports.map((report) => (
              <_.ReportCard
                key={report.reportId}
                onClick={() => handleReportClick(report.reportId)}
              >
                <_.ReportHeader>
                  <_.ReportTopic>{report.topic}</_.ReportTopic>
                  <_.ReportStatus color={getStatusColor(report.status)}>
                    {getStatusText(report.status)}
                  </_.ReportStatus>
                </_.ReportHeader>
                {report.submittedAt && (
                  <_.ReportDate>
                    제출일: {new Date(report.submittedAt).toLocaleDateString()}
                  </_.ReportDate>
                )}
              </_.ReportCard>
            ))
          )}
        </_.ReportsContainer>
      </_.Container>
    );
  }

  // 학생용 UI
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