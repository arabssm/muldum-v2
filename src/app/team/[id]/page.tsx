import TeamDetail from '@/widgets/student/TeamDetail';

interface TeamDetailPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function TeamDetailPage({params}: TeamDetailPageProps) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      throw new Error('팀 ID가 없습니다');
    }
    return <TeamDetail />
  } catch (error) {
    console.error('TeamDetailPage 에러:', error);
    return <div>팀 정보를 불러올 수 없습니다.</div>;
  }
}