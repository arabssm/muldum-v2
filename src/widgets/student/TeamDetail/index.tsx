"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as _ from './style';
import { getTeacherReportList } from '@/shared/api/monthReport';
import type { MonthReportSimpleResponse } from '@/shared/api/monthReport';
import { showToast } from '@/shared/ui/toast';
import { getUserInfo } from '@/shared/api/user';
import Notion from '@/widgets/student/notion';
import MonthlyTest from '@/widgets/student/monthlyTest';
import Calendar from '@/widgets/student/calendar';
import VideoChat from '@/widgets/student/videoChat';
import { sections } from '@/widgets/student/monthlyTest/data';
import Loading from '@/shared/ui/loading';

type TabType = '노션' | '월말평가' | '캘린더' | '화상채팅';

export default function TeamDetail() {
  const params = useParams();
  const router = useRouter();
  const teamId = Number(params.id);
  const [activeTab, setActiveTab] = useState<TabType>('노션');
  const [reports, setReports] = useState<MonthReportSimpleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUserRole(userInfo.user_type);
        setUserTeamId(userInfo.teamId || null);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        showToast.error('사용자 정보를 불러올 수 없습니다');
        // 기본값 설정
        setUserRole('STUDENT');
        setUserTeamId(null);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userRole !== 'TEACHER' || activeTab !== '월말평가') return;

    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const data = await getTeacherReportList(teamId);
        console.log('API 응답:', data);
        if (Array.isArray(data)) {
          setReports(data);
        } else if (data && typeof data === 'object' && 'reports' in data) {
          setReports((data as any).reports || []);
        } else {
          console.error('응답이 배열이 아닙니다:', data);
          setReports([]);
        }
      } catch (error: any) {
        console.error('월말평가 목록 조회 실패:', error);
        const errorMessage = error?.response?.data?.message || '월말평가 목록을 불러오는데 실패했습니다';
        showToast.error(errorMessage);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [teamId, userRole, activeTab]);

  const handleReportClick = (reportId: number) => {
    router.push(`/monthWatch?report_id=${reportId}`);
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

  // 본인 팀인지 확인
  const isMyTeam = userTeamId === teamId;
  
  // 본인 팀이면 4개 탭, 아니면 노션만
  const tabs: TabType[] = isMyTeam 
    ? ['노션', '월말평가', '캘린더', '화상채팅']
    : ['노션'];
  
  // 선생님이면 노션, 월말평가 2개 탭
  const teacherTabs: TabType[] = ['노션', '월말평가'];
  const finalTabs = userRole === 'TEACHER' ? teacherTabs : tabs;

  const renderTabContent = () => {
    switch (activeTab) {
      case '노션':
        // 본인 팀이 아니거나 선생님이면 읽기 전용
        return <Notion teamId={String(teamId)} readOnly={!isMyTeam || userRole === 'TEACHER'} />;
      
      case '월말평가':
        if (userRole === 'TEACHER') {
          // 선생님: 다른 팀 월말평가 조회
          return isLoading ? (
            <div><Loading /></div>
          ) : reports.length === 0 ? (
            <_.EmptyMessage>작성된 월말평가가 없습니다</_.EmptyMessage>
          ) : (
            <_.ReportList>
              {reports.map((report) => (
                <_.ReportItem key={report.reportId} onClick={() => handleReportClick(report.reportId)}>
                  <_.ReportInfo>
                    <_.ReportTopic>{report.topic}</_.ReportTopic>
                  </_.ReportInfo>
                  <_.StatusBadge status={report.status}>
                    {getStatusText(report.status)}
                  </_.StatusBadge>
                </_.ReportItem>
              ))}
            </_.ReportList>
          );
        } else {
          // 학생: 본인 팀 월말평가 작성
          return <MonthlyTest sections={sections} />;
        }
      
      case '캘린더':
        return <Calendar />;
      
      case '화상채팅':
        return <VideoChat />;
      
      default:
        return null;
    }
  };

  return (
    <_.Container>
      {finalTabs.length > 1 && (
        <_.TabGroup>
          {finalTabs.map((tab) => (
            <_.TabButton
              key={tab}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </_.TabButton>
          ))}
        </_.TabGroup>
      )}

      {renderTabContent()}
    </_.Container>
  );
}
