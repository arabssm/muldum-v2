import TeamDetail from '@/widgets/TeamDetail';

interface TeamDetailPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function TeamDetailPage({params}: TeamDetailPageProps) {
  const {id} = await params;
  return <TeamDetail />
}