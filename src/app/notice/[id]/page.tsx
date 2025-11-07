import NoticeDetail from '@/widgets/student/noticeDetail';

interface NoticeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NoticeDetailPage({params}: NoticeDetailPageProps) {
  const { id } = await params;
  return <NoticeDetail id={id} />
}