import TeamDetail from '@/widgets/TeamDetail';

interface TeamDetailPageProps {
  params: {
    id: string;
  }
}

export default function TeamDetailPage({params}: TeamDetailPageProps) {
  const {id} = params;
  return <TeamDetail />
}