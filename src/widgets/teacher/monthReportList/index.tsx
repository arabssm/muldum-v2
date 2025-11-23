"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as _ from './style';
import { useTeams } from '@/shared/hooks/team';
import { getTeacherReportList } from '@/shared/api/monthReport';
import type { MonthReportSimpleResponse } from '@/shared/api/monthReport';
import { showToast } from '@/shared/ui/toast';

export default function MonthReportList() {
  const router = useRouter();
  const { teams, isLoading: teamsLoading } = useTeams('전공동아리');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [reports, setReports] = useState<MonthReportSimpleResponse[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    if (selectedTeamId === null) return;

    const fetchReports = async () => {
      try {
        setReportsLoading(true);
        const data = await getTeacherReportList(selectedTeamId);
        console.log('API 응답:', data);
        // 배열인지 확인하고 처리
        if (Array.isArray(data)) {
          setReports(data);
        } else if (data && typeof data === 'object' && 'reports' in data) {
          // { reports: [...] } 형태인 경우
          setReports((data as any).reports || []);
        } else {
          console.error('응답이 배열이 아닙니다:', data);
          setReports([]);
        }
      } catch (error) {
        console.error('월말평가 목록 조회 실패:', error);
        showToast.error('월말평가 목록을 불러오는데 실패했습니다');
        setReports([]);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchReports();
  }, [selectedTeamId]);

  const handleTeamClick = (teamId: number) => {
    setSelectedTeamId(teamId);
  };

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

  if (teamsLoading) {
    return (
      <_.Container>
        <div>로딩 중...</div>
      </_.Container>
    );
  }

  return (
    <_.Container>
      <_.Section>
        <_.Header>
          <_.Title>팀 선택</_.Title>
        </_.Header>
        <_.TeamList>
          {teams.map((team) => (
            <_.TeamItem
              key={team.id}
              isSelected={selectedTeamId === team.id}
              onClick={() => handleTeamClick(team.id!)}
            >
              <_.TeamName>{team.name}</_.TeamName>
              <_.TeamMembers>
                {team.members.join(', ')}
              </_.TeamMembers>
            </_.TeamItem>
          ))}
        </_.TeamList>
      </_.Section>

      {selectedTeamId && (
        <_.Section>
          <_.Header>
            <_.Title>월말평가 목록</_.Title>
          </_.Header>

          {reportsLoading ? (
            <div>로딩 중...</div>
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
          )}
        </_.Section>
      )}
    </_.Container>
  );
}
