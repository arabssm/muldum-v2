import NoticeEdit from '@/widgets/teacher/noticeEdit';

interface NoticeEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeEditPage({ params }: NoticeEditPageProps) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
      throw new Error('공지 ID가 없습니다');
    }
    return <NoticeEdit id={resolvedParams.id} />;
  } catch (error) {
    console.error('NoticeEditPage 에러:', error);
    return <div>공지를 수정할 수 없습니다.</div>;
  }
}
