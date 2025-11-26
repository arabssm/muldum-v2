"use client";

import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import * as _ from './style';
import { getDashboard, DashboardStats } from '@/shared/api/tasks';
import { showToast } from '@/shared/ui/toast';
import Loading from '@/shared/ui/loading';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      showToast.error('대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!stats) return <_.EmptyMessage>데이터가 없습니다.</_.EmptyMessage>;

  // 전체 작업 상태 차트 데이터
  const overallChartData = {
    labels: ['시작 전', '진행 중', '완료'],
    datasets: [
      {
        data: [stats.overallStats.todo, stats.overallStats.inProgress, stats.overallStats.done],
        backgroundColor: ['#E5E5E5', '#FFD6D6', '#FF9B62'],
        borderWidth: 0,
      },
    ],
  };

  // 분야별 작업 차트 데이터
  const categoryChartData = {
    labels: ['프론트엔드', '백엔드', '디자인', 'AI'],
    datasets: [
      {
        label: '작업 수',
        data: [stats.categoryStats.frontend, stats.categoryStats.backend, stats.categoryStats.design, stats.categoryStats.ai],
        backgroundColor: ['#FF9B62', '#FFD6D6', '#FFB88C', '#FFC9A6'],
        borderRadius: 4,
      },
    ],
  };

  // 팀원별 작업 차트 데이터
  const memberChartData = {
    labels: stats.memberStats.map((m) => m.memberName),
    datasets: [
      {
        label: '시작 전',
        data: stats.memberStats.map((m) => m.todo),
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
      },
      {
        label: '진행 중',
        data: stats.memberStats.map((m) => m.inProgress),
        backgroundColor: '#FFD6D6',
        borderRadius: 4,
      },
      {
        label: '완료',
        data: stats.memberStats.map((m) => m.done),
        backgroundColor: '#FF9B62',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        onClick: () => {}, // 범례 클릭 비활성화
      },
    },
  };

  // 월별 완료 작업 차트 데이터
  const monthlyChartData = {
    labels: stats.monthlyCompletions.map((m) => `${m.month}월`),
    datasets: [
      {
        label: '완료 작업 수',
        data: stats.monthlyCompletions.map((m) => m.success),
        backgroundColor: '#FF9B62',
        borderRadius: 4,
      },
    ],
  };

  return (
    <_.Container>
      <_.Header>
        <_.Title>대시보드</_.Title>
      </_.Header>

      {/* 전체 통계 카드 */}
      <_.StatsGrid>
        <_.StatCard color="#FF9B62">
          <_.StatNumber>{stats.overallStats.total}</_.StatNumber>
          <_.StatLabel>전체 작업</_.StatLabel>
        </_.StatCard>
        <_.StatCard color="#E5E5E5">
          <_.StatNumber>{stats.overallStats.todo}</_.StatNumber>
          <_.StatLabel>시작 전</_.StatLabel>
        </_.StatCard>
        <_.StatCard color="#FFD6D6">
          <_.StatNumber>{stats.overallStats.inProgress}</_.StatNumber>
          <_.StatLabel>진행 중</_.StatLabel>
        </_.StatCard>
        <_.StatCard color="#FF9B62">
          <_.StatNumber>{stats.overallStats.done}</_.StatNumber>
          <_.StatLabel>완료</_.StatLabel>
        </_.StatCard>
      </_.StatsGrid>

      {/* 차트 그리드 */}
      <_.ChartsGrid>
        <_.ChartCard>
          <_.ChartTitle>전체 작업 상태</_.ChartTitle>
          <_.ChartWrapper>
            <Doughnut data={overallChartData} options={chartOptions} />
          </_.ChartWrapper>
        </_.ChartCard>

        <_.ChartCard>
          <_.ChartTitle>분야별 작업 분포</_.ChartTitle>
          <_.ChartWrapper>
            <Bar data={categoryChartData} options={chartOptions} />
          </_.ChartWrapper>
        </_.ChartCard>
      </_.ChartsGrid>

      {/* 팀원별 작업 현황 */}
      {stats.memberStats.length > 0 && (
        <_.ChartCard style={{ marginTop: '20px' }}>
          <_.ChartTitle>팀원별 작업 현황</_.ChartTitle>
          <_.ChartWrapper style={{ height: '300px' }}>
            <Bar data={memberChartData} options={chartOptions} />
          </_.ChartWrapper>
        </_.ChartCard>
      )}

      {/* 월별 완료 작업 추이 */}
      {stats.monthlyCompletions.length > 0 && (
        <_.ChartCard style={{ marginTop: '20px' }}>
          <_.ChartTitle>월별 완료 작업 수 (올해)</_.ChartTitle>
          <_.ChartWrapper style={{ height: '300px' }}>
            <Bar data={monthlyChartData} options={chartOptions} />
          </_.ChartWrapper>
        </_.ChartCard>
      )}

      {/* 알림 섹션 */}
      {stats.overdueTasks.length > 0 && (
        <_.AlertsGrid>
          {/* 기한 초과 작업 */}
          <_.AlertCard type="error">
            <_.AlertTitle>기한 초과 작업 ({stats.overdueTasks.length})</_.AlertTitle>
            <_.TaskList>
              {stats.overdueTasks.map((task) => (
                <_.TaskItem key={task.taskId}>
                  <_.TaskItemTitle>{task.title}</_.TaskItemTitle>
                  <_.TaskItemInfo>
                    <span>마감: {task.deadline}</span>
                    <span>담당: {task.assignee?.name || '미지정'}</span>
                  </_.TaskItemInfo>
                </_.TaskItem>
              ))}
            </_.TaskList>
          </_.AlertCard>
        </_.AlertsGrid>
      )}
    </_.Container>
  );
}
