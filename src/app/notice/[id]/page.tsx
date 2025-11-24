import NoticeDetail from '@/widgets/student/noticeDetail';

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      throw new Error('공지 ID가 없습니다');
    }
    return <NoticeDetail id={resolvedParams.id} />;
  } catch (error) {
    console.error('NoticeDetailPage 에러:', error);
    return <div>공지를 불러올 수 없습니다.</div>;
  }
}