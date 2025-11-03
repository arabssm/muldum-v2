import NoticeDetail from '@/widgets/student/noticeDetail';

interface NoticeDetailPageProps {
  params: {
    id: string;
  };
}

export default function NoticeDetailPage({params}: NoticeDetailPageProps) {
  const { id } = params;
  return <NoticeDetail id={id} />
}